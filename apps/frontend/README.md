# Frontend Application

Next.js 16 frontend application with App Router, TypeScript, and shadcn/ui design system.

## Features

- **Next.js 16** - Latest Next.js with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **Eden Treaty** - Type-safe API client
- **Better Auth** - Authentication integration
- **Vitest** - Testing framework
- **Sonner** - Toast notifications

## Prerequisites

- Node.js 20+
- npm or your preferred package manager

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will start at http://localhost:3000 with hot reload enabled.

## Build

```bash
npm run build
```

## Production

```bash
npm run start
```

## Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui

# Coverage
npm run test:coverage
```

## Linting

```bash
npm run lint
```

## Environment Variables

Create `.env.local` file (see `.env.example` for template):

- `NEXT_PUBLIC_API_URL` - Backend API URL (required)
- `NODE_ENV` - Environment (development/production)
- `NEXT_PUBLIC_LOG_LEVEL` - Log level (optional)

## Project Structure

```
apps/frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── profile/            # Profile page
│   └── subscription/       # Subscription page
├── components/             # React components
│   ├── ui/                 # Design system components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── error-boundary.tsx  # Error boundary component
│   └── user-profile.tsx     # User profile component
├── lib/                    # Utilities and helpers
│   ├── api.ts              # Eden Treaty API client
│   ├── auth-client.ts      # Better Auth client
│   ├── env.ts              # Environment validation
│   ├── logger.ts           # Logger utility
│   ├── toast.ts            # Toast notifications
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
├── vitest.config.ts        # Vitest configuration
└── next.config.ts          # Next.js configuration
```

## Design System

The project uses shadcn/ui components located in `components/ui/`. See the [Design System Documentation](../../docs/DESIGN_SYSTEM.md) for more details.

### Available Components

- Button (with variants)
- Card (with Header, Title, Content, Footer)
- Input
- Textarea
- Label
- Badge
- Avatar
- Separator
- Dialog

## Type Safety

The frontend uses Eden Treaty for type-safe API calls:

```typescript
import { api } from '@/lib/api';

// Fully typed API calls
const { data } = await api.api.todos.get();
```

## Error Handling

The application includes an Error Boundary component for graceful error handling:

```tsx
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Docker

### Build

```bash
docker build -t your-project-frontend .
```

### Run

```bash
docker run -p 3000:3000 your-project-frontend
```

See [Deployment Guide](../../docs/DEPLOYMENT.md) for more deployment options.

## CI/CD

GitHub Actions workflows are configured for:

- **Tests**: `.github/workflows/frontend-tests.yml`
- **Docker**: `.github/workflows/frontend-docker.yml`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Eden Treaty Documentation](https://elysiajs.com/eden/treaty/)
- [Better Auth Documentation](https://www.better-auth.com/)
