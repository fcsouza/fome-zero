# Backend API

Backend API built with Elysia.js and Bun runtime.

## Prerequisites

- [Bun](https://bun.sh) runtime installed

## Installation

```bash
bun install
```

## Development

```bash
bun run dev
```

The server will start at http://localhost:3002 with hot reload enabled.

## Production

```bash
bun run start
```

## Build

```bash
bun run build
```

## API Endpoints

- `GET /api/` - Welcome message with API info
- `GET /api/health` - Health check endpoint

### Health Check

The health check endpoint provides system status information:

```bash
curl http://localhost:3002/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0",
  "commitSha": "abc123"
}
```

Use this endpoint for:
- Load balancer health checks
- Monitoring systems
- Deployment verification
- Container orchestration (Kubernetes liveness/readiness probes)

### OpenAPI Documentation

Interactive API documentation is available at:

- **Development**: `http://localhost:3002/docs`
- **Production**: `https://your-domain.com/docs`

The OpenAPI (Swagger) documentation provides:
- Complete endpoint descriptions
- Request/response schemas
- Try-it-out functionality
- Authentication requirements

See [API Documentation](../../docs/API.md) for detailed endpoint documentation.

## Docker

### Build

```bash
docker build -t fomezero-backend .
```

### Run

```bash
docker run -p 3002:3002 fomezero-backend
```

## Environment Variables

### Required for Basic Setup

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Authentication secret
- `BETTER_AUTH_URL` - Auth server URL
- `PORT` - Server port (default: 3002)

### Required for Stripe Integration

- `STRIPE_SECRET_KEY` - Stripe secret key (required for Stripe integration)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret (required for Stripe integration)

### Optional for Stripe Integration

- `STRIPE_BASIC_PRICE_ID` - Stripe Price ID for basic plan (defaults to hardcoded value if not set)
- `STRIPE_PRO_PRICE_ID` - Stripe Price ID for pro plan (defaults to hardcoded value if not set)

### Required for Email Notifications (Resend)

- `RESEND_API_KEY` - Resend API key for sending subscription email notifications
- `RESEND_FROM_EMAIL` - Email address to send emails from (defaults to 'onboarding@resend.dev' if not set)

## Stripe Webhook Setup

To enable Stripe subscriptions, you need to configure webhooks in your Stripe Dashboard:

1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://your-domain.com/api/auth/stripe/webhook`
   - For local development, use Stripe CLI: `stripe listen --forward-to localhost:3002/api/auth/stripe/webhook`
4. Select the following events:
   - `checkout.session.completed` - Updates subscription status after checkout
   - `customer.subscription.updated` - Updates subscription details when changed
   - `customer.subscription.deleted` - Marks subscription as canceled
5. Copy the webhook signing secret and add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

### Testing Webhooks Locally

For local development, use the Stripe CLI:

```bash
# Install Stripe CLI (if not already installed)
# macOS: brew install stripe/stripe-cli/stripe
# Linux: See https://stripe.com/docs/stripe-cli

# Forward webhooks to local server
stripe listen --forward-to localhost:3002/api/auth/stripe/webhook

# This will output a webhook signing secret (starts with whsec_)
# Use this value for STRIPE_WEBHOOK_SECRET in your local .env file
```

### Webhook Endpoint

The webhook endpoint is automatically handled by Better Auth at:
- Production: `https://your-domain.com/api/auth/stripe/webhook`
- Development: `http://localhost:3002/api/auth/stripe/webhook`

Better Auth automatically verifies webhook signatures and processes the events.

## Subscription Email Notifications

The application automatically sends email notifications for subscription lifecycle events using Resend:

### Subscription Events

- **Subscription Complete**: Welcome email sent when a subscription is successfully created
- **Subscription Update**: Email sent when subscription status changes (e.g., active, past_due)
- **Subscription Cancel**: Email sent when a subscription is canceled
- **Subscription Deleted**: Logged for monitoring (no email sent)

### Trial Events (Pro Plan Only)

- **Trial Start**: Email sent when a 14-day trial begins
- **Trial End**: Email sent when trial converts to paid subscription
- **Trial Expired**: Email sent when trial expires without conversion

### Setup

1. Sign up for a [Resend account](https://resend.com)
2. Get your API key from the Resend dashboard
3. Set `RESEND_API_KEY` environment variable
4. (Optional) Set `RESEND_FROM_EMAIL` to use a custom sender email
   - Default: `onboarding@resend.dev`
   - For production, use a verified domain email (e.g., `noreply@yourdomain.com`)

### Email Service Architecture

The email service (`src/services/email.service.ts`) follows SOLID principles:
- **Single Responsibility**: Handles all email sending operations
- **Dependency Inversion**: Can be easily swapped with another email provider
- **Error Handling**: Gracefully handles missing API keys in development

In development, if `RESEND_API_KEY` is not set, emails are logged to console instead of being sent.
