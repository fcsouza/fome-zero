import { createHash } from 'node:crypto';
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { env } from '../config/env';
import type { Donation, DonationAnalysis } from '../db/schema';
import { createChildLogger } from '../utils/logger';

const logger = createChildLogger({ module: 'certificate-service' });

export interface CertificateData {
  donation: Donation;
  analysis?: DonationAnalysis;
  doadorName: string;
  doadorCnpj?: string;
}

/**
 * Certificate Service - Generates PDF certificates for donations
 */
export class CertificateService {
  private readonly storagePath: string;

  constructor() {
    this.storagePath = env.CERTIFICATE_STORAGE_PATH || './certificates';
  }

  /**
   * Generate certificate number in format DS-YYYY-XXXXX
   */
  private generateCertificateNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, '0');
    return `DS-${year}-${random}`;
  }

  /**
   * Generate SHA-256 hash of evidence data
   */
  private generateHash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate QR code as base64 data URL
   */
  private async generateQRCodeDataUrl(
    certificateId: string,
    certificateNumber: string
  ): Promise<string> {
    const verificationUrl = `${env.FRONTEND_URL}/certificado/${certificateId}`;
    const qrData = JSON.stringify({
      id: certificateId,
      number: certificateNumber,
      url: verificationUrl,
    });

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 200,
      });
      return qrCodeDataUrl;
    } catch (error) {
      logger.error({ err: error }, 'Error generating QR code');
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate PDF certificate
   */
  async generateCertificate(
    certificateId: string,
    data: CertificateData
  ): Promise<{
    certificateNumber: string;
    pdfPath: string;
    qrCode: string;
    hashSha256: string;
  }> {
    try {
      // Ensure storage directory exists
      await mkdir(this.storagePath, { recursive: true });

      const certificateNumber = this.generateCertificateNumber();
      const pdfPath = join(this.storagePath, `${certificateId}.pdf`);

      // Generate QR code
      const qrCodeDataUrl = await this.generateQRCodeDataUrl(
        certificateId,
        certificateNumber
      );

      // Load logo image
      const logoPath = join(process.cwd(), 'images', 'doe seguro.png');
      let logoBuffer: Buffer | null = null;
      try {
        logoBuffer = await readFile(logoPath);
      } catch (error) {
        logger.warn({ err: error, logoPath }, 'Logo image not found, continuing without logo');
      }

      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      // Logo
      if (logoBuffer) {
        doc.image(logoBuffer, {
          fit: [150, 150],
          align: 'center',
        });
        doc.moveDown();
      }

      // Header
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('CERTIFICADO DE DOAÇÃO SEGURA', { align: 'center' })
        .moveDown();

      doc
        .fontSize(14)
        .font('Helvetica')
        .text(`Nº ${certificateNumber}`, { align: 'center' })
        .moveDown(2);

      // Declaration section
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('DECLARAÇÃO DE CONFORMIDADE', { align: 'left' })
        .moveDown();

      doc.fontSize(10).font('Helvetica');

      const declarationText = `O estabelecimento ${data.doadorName}${
        data.doadorCnpj ? `, CNPJ ${data.doadorCnpj}` : ''
      }, declara que os alimentos abaixo descritos foram avaliados e considerados PRÓPRIOS PARA CONSUMO HUMANO no momento da doação, em conformidade com:

• Lei Federal 15.224/2025
• RDC ANVISA 216/2004
• Guia ANVISA 57/2022
• Boas práticas de manipulação de alimentos`;

      doc.text(declarationText, { align: 'justify' }).moveDown(2);

      // Food details section
      doc.font('Helvetica-Bold').text('ALIMENTOS DOADOS:').moveDown();
      doc.font('Helvetica');

      const foodDetails = [
        `Tipo: ${data.donation.tipoAlimento}`,
        data.donation.descricao
          ? `Descrição: ${data.donation.descricao}`
          : null,
        data.donation.quantidade
          ? `Quantidade: ${data.donation.quantidade}`
          : null,
        data.donation.temperatura
          ? `Temperatura: ${data.donation.temperatura}`
          : null,
        data.donation.prazoConsumo
          ? `Prazo para consumo: ${data.donation.prazoConsumo}`
          : null,
      ]
        .filter(Boolean)
        .join('\n');

      doc.text(foodDetails).moveDown(2);

      // AI Analysis section
      if (data.analysis?.aiResponse) {
        const analysis = data.analysis.aiResponse as {
          proprio_para_doacao?: boolean;
          recomendacao?: string;
          observacoes?: string;
        };

        doc.font('Helvetica-Bold').text('AVALIAÇÃO:').moveDown();
        doc.font('Helvetica');

        if (analysis.proprio_para_doacao) {
          doc.fillColor('green').text('✅ Aprovado por análise visual IA');
        } else {
          doc.fillColor('orange').text('⚠️ Aprovado com restrições');
        }

        doc.fillColor('black');

        if (analysis.recomendacao) {
          doc.text(`Recomendação: ${analysis.recomendacao}`).moveDown();
        }

        if (analysis.observacoes) {
          doc.text(`Observações: ${analysis.observacoes}`).moveDown();
        }

        doc.moveDown();
      }

      // Legal protection section
      doc
        .fontSize(9)
        .font('Helvetica-Oblique')
        .text(
          'Esta doação está protegida pelo Art. 1º da Lei 14.016/2020, que isenta o doador de responsabilidade civil ou penal desde que observadas as normas de segurança alimentar.',
          { align: 'justify' }
        )
        .moveDown(2);

      // QR Code
      const qrCodeMatch = qrCodeDataUrl.match(/base64,(.+)/);
      if (qrCodeMatch) {
        doc.image(Buffer.from(qrCodeMatch[1], 'base64'), {
          fit: [100, 100],
          align: 'center',
        });
      }

      doc.moveDown();
      doc
        .fontSize(8)
        .font('Helvetica')
        .text(
          `Código de verificação: ${certificateId}`,
          { align: 'center' }
        );

      // Generate hash
      const evidenceData = JSON.stringify({
        certificateNumber,
        donationId: data.donation.id,
        timestamp: new Date().toISOString(),
        data,
      });
      const hashSha256 = this.generateHash(evidenceData);

      // Wait for PDF to be written
      await new Promise<void>((resolve, reject) => {
        doc.on('end', async () => {
          try {
            const pdfBuffer = Buffer.concat(chunks);
            await Bun.write(pdfPath, pdfBuffer);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
        doc.on('error', reject);
        doc.end();
      });

      logger.info(
        { certificateNumber, certificateId },
        'Certificate generated successfully'
      );

      return {
        certificateNumber,
        pdfPath,
        qrCode: qrCodeDataUrl,
        hashSha256,
      };
    } catch (error) {
      logger.error({ err: error }, 'Error generating certificate');
      throw error;
    }
  }

  /**
   * Get certificate file path
   */
  getCertificatePath(certificateId: string): string {
    return join(this.storagePath, `${certificateId}.pdf`);
  }
}

export const certificateService = new CertificateService();

