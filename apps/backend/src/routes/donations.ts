import { Elysia, t } from 'elysia';
import { betterAuth } from '../plugins/better-auth.plugin';
import { servicesPlugin } from '../plugins/services.plugin';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { env } from '../config/env';

const NOT_FOUND_STATUS_CODE = 404;
const BAD_REQUEST_STATUS_CODE = 400;

const analyzeRequestModel = t.Object({
  image: t.String({ minLength: 1 }),
  text: t.Optional(t.String()),
});

const createDonationModel = t.Object({
  tipoAlimento: t.String({ minLength: 1 }),
  descricao: t.Optional(t.String()),
  quantidade: t.Optional(t.String()),
  temperatura: t.Optional(t.String()),
  prazoConsumo: t.Optional(t.String()),
  imageData: t.Optional(t.String()),
  textInput: t.Optional(t.String()),
  aiResponse: t.Optional(t.Record(t.String(), t.Any())),
});

const updateDonationModel = t.Object({
  status: t.Optional(t.String()),
  tipoAlimento: t.Optional(t.String()),
  descricao: t.Optional(t.String()),
  quantidade: t.Optional(t.String()),
  temperatura: t.Optional(t.String()),
  prazoConsumo: t.Optional(t.String()),
});

const checklistModel = t.Object({
  checklistType: t.String({ minLength: 1 }),
  responses: t.Record(t.String(), t.Any()),
});

const errorModel = t.Object({
  message: t.String(),
});

export const donationsRoute = new Elysia({ prefix: '/donations' })
  .use(betterAuth)
  .use(servicesPlugin)
  .post(
    '/analyze',
    async ({ body, aiService, set }) => {
      try {
        const result = await aiService.analyzeFood(
          body.image,
          body.text || ''
        );
        return result;
      } catch (error) {
        set.status = BAD_REQUEST_STATUS_CODE;
        return {
          message:
            error instanceof Error
              ? error.message
              : 'Failed to analyze food image',
        };
      }
    },
    {
      auth: true,
      body: analyzeRequestModel,
      response: {
        200: t.Record(t.String(), t.Any()),
        400: errorModel,
      },
      detail: {
        summary: 'Analyze food image',
        description:
          'Analyze a food image using AI to determine if it is suitable for donation',
        tags: ['donations'],
      },
    }
  )
  .post(
    '/',
    async ({ body, user, donationService, set }) => {
      try {
        // Create donation
        const donation = await donationService.createDonation({
          doadorId: user.id,
          status: 'pending',
          tipoAlimento: body.tipoAlimento,
          descricao: body.descricao,
          quantidade: body.quantidade,
          temperatura: body.temperatura,
          prazoConsumo: body.prazoConsumo,
        });

        // Save analysis if provided
        if (body.imageData && body.aiResponse) {
          await donationService.saveAnalysis(
            donation.id,
            body.imageData,
            body.textInput || '',
            body.aiResponse
          );
        }

        return donation;
      } catch (error) {
        set.status = BAD_REQUEST_STATUS_CODE;
        return {
          message:
            error instanceof Error
              ? error.message
              : 'Failed to create donation',
        };
      }
    },
    {
      auth: true,
      body: createDonationModel,
      response: {
        200: t.Record(t.String(), t.Any()),
        400: errorModel,
      },
      detail: {
        summary: 'Create donation',
        description: 'Create a new donation',
        tags: ['donations'],
      },
    }
  )
  .get(
    '/',
    async ({ query, user, donationService, set }) => {
      try {
        const filters: {
          doadorId?: string;
          status?: string;
        } = {};

        // If user is doador, show only their donations
        if (user.role === 'doador') {
          filters.doadorId = user.id;
        }

        // If user is ong, show only available donations
        if (user.role === 'ong') {
          filters.status = query.status || 'available';
        } else if (query.status) {
          filters.status = query.status as string;
        }

        const donations = await donationService.getAllDonations(filters);
        return donations;
      } catch (error) {
        set.status = BAD_REQUEST_STATUS_CODE;
        return {
          message:
            error instanceof Error
              ? error.message
              : 'Failed to get donations',
        };
      }
    },
    {
      auth: true,
      query: t.Object({
        status: t.Optional(t.String()),
      }),
      response: {
        200: t.Array(t.Record(t.String(), t.Any())),
        400: errorModel,
      },
      detail: {
        summary: 'Get donations',
        description: 'Get list of donations with optional filters',
        tags: ['donations'],
      },
    }
  )
  .get(
    '/:id',
    async ({ params: { id }, donationService, set }) => {
      try {
        const donation = await donationService.getDonationById(id);
        const analysis = await donationService.getAnalysisByDonationId(id);
        const certificate = await donationService.getCertificateByDonationId(
          id
        );

        return {
          ...donation,
          analysis,
          certificate,
        };
      } catch (error) {
        set.status = NOT_FOUND_STATUS_CODE;
        return {
          message:
            error instanceof Error ? error.message : 'Donation not found',
        };
      }
    },
    {
      auth: true,
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: t.Record(t.String(), t.Any()),
        404: errorModel,
      },
      detail: {
        summary: 'Get donation by ID',
        description: 'Get a specific donation with analysis and certificate',
        tags: ['donations'],
      },
    }
  )
  .patch(
    '/:id',
    async ({ params: { id }, body, user, donationService, set }) => {
      try {
        const donation = await donationService.getDonationById(id);

        // Only doador can update their own donations
        if (donation.doadorId !== user.id) {
          set.status = 403;
          return { message: 'Forbidden' };
        }

        const updated = await donationService.updateDonation(id, body);
        return updated;
      } catch (error) {
        set.status = NOT_FOUND_STATUS_CODE;
        return {
          message:
            error instanceof Error ? error.message : 'Donation not found',
        };
      }
    },
    {
      auth: true,
      params: t.Object({
        id: t.String(),
      }),
      body: updateDonationModel,
      response: {
        200: t.Record(t.String(), t.Any()),
        404: errorModel,
      },
      detail: {
        summary: 'Update donation',
        description: 'Update an existing donation',
        tags: ['donations'],
      },
    }
  )
  .post(
    '/:id/checklist',
    async ({ params: { id }, body, user, donationService, checklistService, set }) => {
      try {
        const donation = await donationService.getDonationById(id);

        // Only doador can submit checklist for their own donations
        if (donation.doadorId !== user.id) {
          set.status = 403;
          return { message: 'Forbidden' };
        }

        // Validate checklist
        const validation = checklistService.validateChecklist(
          body.checklistType,
          body.responses
        );

        if (!validation.valid) {
          set.status = BAD_REQUEST_STATUS_CODE;
          return {
            message: `Validation failed: ${validation.errors.join(', ')}`,
          };
        }

        // Determine if approved based on responses
        // This is a simplified logic - can be enhanced
        const approved = Object.values(body.responses).every(
          (value) => value !== false && value !== 'false' && value !== 'no'
        );

        const checklist = await checklistService.saveChecklist(
          id,
          body.checklistType,
          body.responses,
          approved
        );

        // Update donation status if checklist is approved
        if (approved) {
          await donationService.updateDonation(id, { status: 'available' });
        }

        return checklist;
      } catch (error) {
        set.status = NOT_FOUND_STATUS_CODE;
        return {
          message:
            error instanceof Error ? error.message : 'Donation not found',
        };
      }
    },
    {
      auth: true,
      params: t.Object({
        id: t.String(),
      }),
      body: checklistModel,
      response: {
        200: t.Record(t.String(), t.Any()),
        400: errorModel,
        404: errorModel,
      },
      detail: {
        summary: 'Submit checklist',
        description: 'Submit checklist responses for a donation',
        tags: ['donations'],
      },
    }
  )
  .post(
    '/:id/certificate',
    async ({ params: { id }, user, donationService, userService, set }) => {
      try {
        const donation = await donationService.getDonationById(id);

        // Only doador can generate certificate for their own donations
        if (donation.doadorId !== user.id) {
          set.status = 403;
          return { message: 'Forbidden' };
        }

        // Get user info for certificate
        const doador = await userService.getUserById(user.id);

        const certificate = await donationService.generateCertificate(
          id,
          doador.name,
          undefined // CNPJ can be added later if needed
        );

        return certificate;
      } catch (error) {
        set.status = NOT_FOUND_STATUS_CODE;
        return {
          message:
            error instanceof Error
              ? error.message
              : 'Failed to generate certificate',
        };
      }
    },
    {
      auth: true,
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: t.Record(t.String(), t.Any()),
        404: errorModel,
      },
      detail: {
        summary: 'Generate certificate',
        description: 'Generate a PDF certificate for a donation',
        tags: ['donations'],
      },
    }
  )
  .get(
    '/:id/certificate',
    async ({ params: { id }, donationService, certificateService, set }) => {
      try {
        const certificate = await donationService.getCertificateByDonationId(
          id
        );

        if (!certificate) {
          set.status = NOT_FOUND_STATUS_CODE;
          return { message: 'Certificate not found' };
        }

        const pdfPath = certificateService.getCertificatePath(certificate.id);

        try {
          const pdfBuffer = await readFile(pdfPath);
          set.headers['Content-Type'] = 'application/pdf';
          set.headers['Content-Disposition'] = `attachment; filename="certificado-${certificate.certificateNumber}.pdf"`;
          return pdfBuffer;
        } catch (fileError) {
          set.status = 500;
          return { message: 'Failed to read certificate file' };
        }
      } catch (error) {
        set.status = NOT_FOUND_STATUS_CODE;
        return {
          message:
            error instanceof Error ? error.message : 'Certificate not found',
        };
      }
    },
    {
      auth: true,
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: t.Any(), // PDF file
        404: errorModel,
      },
      detail: {
        summary: 'Download certificate',
        description: 'Download the PDF certificate for a donation',
        tags: ['donations'],
      },
    }
  )
  .post(
    '/:id/accept',
    async ({ params: { id }, user, matchService, set }) => {
      try {
        // Only ONG can accept donations
        if (user.role !== 'ong') {
          set.status = 403;
          return { message: 'Only ONGs can accept donations' };
        }

        const match = await matchService.acceptDonation(id, user.id);
        return match;
      } catch (error) {
        set.status = BAD_REQUEST_STATUS_CODE;
        return {
          message:
            error instanceof Error
              ? error.message
              : 'Failed to accept donation',
        };
      }
    },
    {
      auth: true,
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: t.Record(t.String(), t.Any()),
        400: errorModel,
      },
      detail: {
        summary: 'Accept donation',
        description: 'ONG accepts a donation',
        tags: ['donations'],
      },
    }
  )
  .post(
    '/:id/collect',
    async ({ params: { id }, user, matchService, set }) => {
      try {
        // Only ONG can collect donations
        if (user.role !== 'ong') {
          set.status = 403;
          return { message: 'Only ONGs can collect donations' };
        }

        // Find match for this donation
        const matches = await matchService.getAllMatches({
          donationId: id,
          ongId: user.id,
        });

        const activeMatch = matches.find(
          (m) => m.status === 'accepted' || m.status === 'pending'
        );

        if (!activeMatch) {
          set.status = BAD_REQUEST_STATUS_CODE;
          return { message: 'No active match found for this donation' };
        }

        const match = await matchService.confirmCollection(activeMatch.id);
        return match;
      } catch (error) {
        set.status = BAD_REQUEST_STATUS_CODE;
        return {
          message:
            error instanceof Error
              ? error.message
              : 'Failed to confirm collection',
        };
      }
    },
    {
      auth: true,
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: t.Record(t.String(), t.Any()),
        400: errorModel,
      },
      detail: {
        summary: 'Confirm collection',
        description: 'ONG confirms collection of donation',
        tags: ['donations'],
      },
    }
  );

