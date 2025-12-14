import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: text('role'),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const subscription = pgTable('subscription', {
  id: text('id').primaryKey(),
  plan: text('plan').notNull(),
  referenceId: text('reference_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  status: text('status').default('incomplete').notNull(),
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  seats: integer('seats'),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
});

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const donations = pgTable('donations', {
  id: text('id').primaryKey(),
  doadorId: text('doador_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  status: text('status')
    .default('pending')
    .notNull(), // pending, available, accepted, collected, cancelled
  tipoAlimento: text('tipo_alimento').notNull(),
  descricao: text('descricao'),
  quantidade: text('quantidade'),
  temperatura: text('temperatura'),
  prazoConsumo: text('prazo_consumo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const donationAnalyses = pgTable('donation_analyses', {
  id: text('id').primaryKey(),
  donationId: text('donation_id')
    .notNull()
    .references(() => donations.id, { onDelete: 'cascade' }),
  imageData: text('image_data'), // base64 temporário
  textInput: text('text_input'),
  aiResponse: jsonb('ai_response').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const checklistResponses = pgTable('checklist_responses', {
  id: text('id').primaryKey(),
  donationId: text('donation_id')
    .notNull()
    .references(() => donations.id, { onDelete: 'cascade' }),
  checklistType: text('checklist_type').notNull(),
  responses: jsonb('responses').notNull(),
  approved: boolean('approved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const certificates = pgTable('certificates', {
  id: text('id').primaryKey(),
  donationId: text('donation_id')
    .notNull()
    .references(() => donations.id, { onDelete: 'cascade' }),
  certificateNumber: text('certificate_number').notNull().unique(),
  pdfUrl: text('pdf_url').notNull(),
  qrCode: text('qr_code'),
  hashSha256: text('hash_sha256'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const donationMatches = pgTable('donation_matches', {
  id: text('id').primaryKey(),
  donationId: text('donation_id')
    .notNull()
    .references(() => donations.id, { onDelete: 'cascade' }),
  ongId: text('ong_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  status: text('status')
    .default('pending')
    .notNull(), // pending, accepted, collected, cancelled
  acceptedAt: timestamp('accepted_at'),
  collectedAt: timestamp('collected_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recipeSuggestions = pgTable('recipe_suggestions', {
  id: text('id').primaryKey(),
  donationMatchId: text('donation_match_id')
    .notNull()
    .references(() => donationMatches.id, { onDelete: 'cascade' }),
  recipeData: jsonb('recipe_data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type Subscription = typeof subscription.$inferSelect;
export type NewSubscription = typeof subscription.$inferInsert;
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;
export type DonationAnalysis = typeof donationAnalyses.$inferSelect;
export type NewDonationAnalysis = typeof donationAnalyses.$inferInsert;
export type ChecklistResponse = typeof checklistResponses.$inferSelect;
export type NewChecklistResponse = typeof checklistResponses.$inferInsert;
export type Certificate = typeof certificates.$inferSelect;
export type NewCertificate = typeof certificates.$inferInsert;
export type DonationMatch = typeof donationMatches.$inferSelect;
export type NewDonationMatch = typeof donationMatches.$inferInsert;
export type RecipeSuggestion = typeof recipeSuggestions.$inferSelect;
export type NewRecipeSuggestion = typeof recipeSuggestions.$inferInsert;
