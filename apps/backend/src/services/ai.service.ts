import OpenAI, { toFile } from 'openai';
import { env } from '../config/env';
import { createChildLogger } from '../utils/logger';

const logger = createChildLogger({ module: 'ai-service' });

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Regex pattern for extracting JSON from response text
const JSON_PATTERN = /\{[\s\S]*\}/;

export type FoodAnalysisResult = {
  proprio_para_doacao: boolean;
  tipo_alimento: string;
  criterios: {
    dentro_validade: string;
    conservacao_adequada: boolean;
    integridade_preservada: boolean;
    embalagem_integra: string;
    seguranca_sanitaria: boolean;
    propriedades_nutricionais_mantidas: boolean;
  };
  observacoes: string;
  recomendacao: string;
  justificativa: string;
}

/**
 * AI Service - Handles OpenAI API calls for food analysis using Assistants API
 */
export class AIService {
  private readonly assistantId: string;
  private readonly userPrompt: string;

  constructor() {
    this.assistantId =
      env.OPENAI_ASSISTANT_ID || 'asst_vyRpt1RqBGGCZUN31bQXVCak';
    this.userPrompt = `Analise esta imagem de alimento e determine se ele atende aos critérios da Lei nº 14.016/2020 para doação de excedentes alimentares. Avalie os seguintes critérios:\n\n1. Está dentro do prazo de validade? (se visível)\n2. As condições de conservação estão adequadas?\n3. A integridade e segurança sanitária estão comprometidas?\n4. Há danos na embalagem? Se sim, comprometem a segurança?\n5. O alimento apresenta aspecto comercialmente indesejável mas mantém propriedades nutricionais?\n6. É próprio para consumo humano?\n\nRetorne a resposta APENAS em formato JSON com esta estrutura:\n{\n "proprio_para_doacao": true/false,\n "tipo_alimento": "descrição do alimento",\n "criterios": {\n "dentro_validade": true/false/"não_visivel",\n "conservacao_adequada": true/false,\n "integridade_preservada": true/false,\n "embalagem_integra": true/false/"sem_embalagem",\n "seguranca_sanitaria": true/false,\n "propriedades_nutricionais_mantidas": true/false\n },\n "observacoes": "detalhes relevantes observados",\n "recomendacao": "pode ser doado / não pode ser doado / requer inspeção adicional",\n "justificativa": "explicação da decisão"\n}`;
  }

  /**
   * Upload image file to OpenAI
   */
  private async uploadImageFile(
    base64Data: string
  ): Promise<string> {
    try {
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const file = await toFile(imageBuffer, 'food-image.jpg', {
        type: 'image/jpeg',
      });

      const uploadedFile = await openai.files.create({
        file,
        purpose: 'assistants',
      });

      logger.info({ fileId: uploadedFile.id }, 'Image file uploaded');
      return uploadedFile.id;
    } catch (uploadError) {
      logger.error({ err: uploadError }, 'Failed to upload image file');
      throw new Error('Failed to upload image file');
    }
  }

  /**
   * Wait for run to complete with polling
   */
  private async waitForRunCompletion(
    threadId: string,
    runId: string,
    maxWaitTime = 60_000
  ): Promise<void> {
    const startTime = Date.now();
    const pollInterval = 1000; // 1 second

    while (Date.now() - startTime < maxWaitTime) {
      const run = await openai.beta.threads.runs.retrieve(runId, {
        thread_id: threadId,
      });

      if (run.status === 'completed') {
        return;
      }

      if (run.status === 'failed' || run.status === 'cancelled') {
        throw new Error(
          `Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`
        );
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error('Run timeout: exceeded maximum wait time');
  }

  /**
   * Analyze food image and text using OpenAI Assistants API
   * @param imageBase64 - Base64 encoded image
   * @param textInput - Text description/context (optional, will use default prompt if not provided)
   * @returns Analysis result with structured JSON
   */
  async analyzeFood(
    imageBase64: string,
    textInput?: string
  ): Promise<FoodAnalysisResult> {
    if (!env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    try {
      logger.info('Analyzing food with OpenAI Assistants API');

      // Remove data URL prefix if present
      const base64Data = imageBase64.includes(',')
        ? imageBase64.split(',')[1]
        : imageBase64;

      // Upload image file to OpenAI if provided
      const imageFileId = base64Data
        ? await this.uploadImageFile(base64Data)
        : undefined;

      // Build content array for multimodal message
      const content: Array<
        | { type: 'text'; text: string }
        | { type: 'image_file'; image_file: { file_id: string } }
      > = [];

      // Add image file reference
      if (imageFileId) {
        content.push({
          type: 'image_file',
          image_file: {
            file_id: imageFileId,
          },
        });
      }

      // Add text prompt (use custom text if provided, otherwise use default)
      const promptText = textInput
        ? `${this.userPrompt}\n\nInformações adicionais: ${textInput}`
        : this.userPrompt;
      content.push({
        type: 'text',
        text: promptText,
      });

      // Create thread with message
      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: 'user',
            content,
          },
        ],
      });

      logger.info({ threadId: thread.id }, 'Thread created');

      // Create and run assistant
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: this.assistantId,
      });

      logger.info({ runId: run.id, threadId: thread.id }, 'Run created');

      // Wait for run to complete
      await this.waitForRunCompletion(thread.id, run.id);

      // Retrieve messages from thread
      const messages = await openai.beta.threads.messages.list(thread.id, {
        order: 'desc',
        limit: 1,
      });

      const assistantMessage = messages.data[0];
      if (!assistantMessage || assistantMessage.role !== 'assistant') {
        throw new Error('No assistant message found in thread');
      }

      // Extract text content from message
      let responseText = '';
      for (const contentBlock of assistantMessage.content) {
        if (contentBlock.type === 'text') {
          responseText = contentBlock.text.value;
          break;
        }
      }

      if (!responseText) {
        throw new Error('No text content found in assistant message');
      }

      // Try to parse JSON from response
      let analysisResult: FoodAnalysisResult;

      try {
        // Try to extract JSON from the response text
        const jsonMatch = responseText.match(JSON_PATTERN);
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0]) as FoodAnalysisResult;
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        logger.error(
          { err: parseError, responseText },
          'Failed to parse AI response'
        );
        throw new Error('Failed to parse AI response as JSON');
      }

      logger.info(
        { proprio_para_doacao: analysisResult.proprio_para_doacao },
        'Food analysis completed'
      );

      return analysisResult;
    } catch (error) {
      logger.error({ err: error }, 'Error analyzing food with OpenAI');
      throw error;
    }
  }
}

export const aiService = new AIService();

