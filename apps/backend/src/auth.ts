import { stripe } from '@better-auth/stripe';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { env } from './config/env';
import { db } from './db';
import {
  account,
  session,
  subscription as subscriptionTable,
  user as userTable,
  verification,
} from './db/schema';
import { emailService } from './services/email.service';
import { createChildLogger } from './utils/logger';

const logger = createChildLogger({ module: 'auth' });

const stripeClient = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const TRIAL_DAYS = 14;
const SESSION_EXPIRES_IN = 60 * 60 * 24 * 7;
const SESSION_UPDATE_AGE = 60 * 60 * 24;

/**
 * Helper function to get user by reference ID
 */
async function getUserByReferenceId(referenceId: string) {
  const [foundUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, referenceId));
  return foundUser;
}

/**
 * Stripe plugin configuration
 * Required webhook events in Stripe Dashboard:
 * - checkout.session.completed
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * Webhook endpoint: /api/auth/stripe/webhook
 */
const stripePluginConfig =
  stripeClient && process.env.STRIPE_WEBHOOK_SECRET
    ? stripe({
        stripeClient,
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        createCustomerOnSignUp: true,
        subscription: {
          enabled: true,
          plans: [
            {
              name: 'basic',
              priceId:
                process.env.STRIPE_BASIC_PRICE_ID ||
                'price_1SPsz55LUTdYjyD70MeFDmz8',
              limits: {
                projects: 5,
                storage: 10,
              },
            },
            {
              name: 'pro',
              priceId:
                process.env.STRIPE_PRO_PRICE_ID ||
                'price_1SBPmz5LUTdYjyD7izTUWjPP',
              limits: {
                projects: 20,
                storage: 50,
              },
              freeTrial: {
                days: TRIAL_DAYS,
                onTrialStart: async (subscription) => {
                  const foundUser = await getUserByReferenceId(
                    subscription.referenceId
                  );
                  if (foundUser && subscription.trialEnd) {
                    await emailService.sendTrialStartEmail(
                      foundUser.email,
                      subscription.plan,
                      foundUser.name,
                      TRIAL_DAYS,
                      subscription.trialEnd
                    );
                  }
                },
                onTrialEnd: async ({ subscription }, _) => {
                  const foundUser = await getUserByReferenceId(
                    subscription.referenceId
                  );
                  if (foundUser) {
                    await emailService.sendTrialEndEmail(
                      foundUser.email,
                      subscription.plan,
                      foundUser.name
                    );
                  }
                },
                onTrialExpired: async (subscription) => {
                  const foundUser = await getUserByReferenceId(
                    subscription.referenceId
                  );
                  if (foundUser) {
                    await emailService.sendTrialExpiredEmail(
                      foundUser.email,
                      subscription.plan,
                      foundUser.name
                    );
                  }
                },
              },
            },
          ],
          onSubscriptionComplete: async ({ subscription, plan }) => {
            const foundUser = await getUserByReferenceId(
              subscription.referenceId
            );
            if (foundUser) {
              await emailService.sendSubscriptionWelcomeEmail(
                foundUser.email,
                plan.name,
                foundUser.name
              );
            }
          },
          onSubscriptionUpdate: async ({ subscription }) => {
            const foundUser = await getUserByReferenceId(
              subscription.referenceId
            );
            if (foundUser) {
              await emailService.sendSubscriptionUpdateEmail(
                foundUser.email,
                subscription.plan,
                foundUser.name,
                subscription.status
              );
            }
          },
          onSubscriptionCancel: async ({ subscription }) => {
            const foundUser = await getUserByReferenceId(
              subscription.referenceId
            );
            if (foundUser) {
              await emailService.sendSubscriptionCancellationEmail(
                foundUser.email,
                subscription.plan,
                foundUser.name,
                subscription.cancelAtPeriodEnd ?? false,
                subscription.periodEnd || undefined
              );
            }
          },
        },
      })
    : null;

if (process.env.NODE_ENV === 'development' && !stripePluginConfig) {
  logger.warn(
    'Stripe plugin is not configured. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET environment variables to enable subscriptions.'
  );
}

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL || env.FRONTEND_URL,
  trustedOrigins: ['*.vercel.app', 'http://localhost:3000'],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: userTable,
      account,
      session,
      verification,
      subscription: subscriptionTable,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        input: true,
        returned: true, // Permite passar o role durante o signup
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Validar que o role seja 'doador' ou 'ong'
          const role = user.role as string | undefined;
          if (role && role !== 'doador' && role !== 'ong') {
            throw new Error('Role must be either "doador" or "ong"');
          }
          // Retornar os dados do usuário
          const userData = await Promise.resolve(user);
          return { data: userData };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 12,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await emailService.sendVerificationEmail(
        user.email,
        user.name || 'User',
        url
      );
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },
  session: {
    expiresIn: SESSION_EXPIRES_IN,
    updateAge: SESSION_UPDATE_AGE,
  },
  plugins: [openAPI(), ...(stripePluginConfig ? [stripePluginConfig] : [])],
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
// biome-ignore lint/suspicious/noAssignInExpressions: _
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: (prefix = '/api/auth') =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          const operation = reference[key]?.[
            method as keyof (typeof reference)[typeof key]
          ] as { tags?: string[] } | undefined;

          if (operation) {
            operation.tags = ['Better Auth'];
          }
        }
      }

      return reference;
    }) as Promise<Record<string, Record<string, unknown>>>,
  components: getSchema().then(({ components }) => components) as Promise<
    Record<string, unknown>
  >,
} as const;
