# Use the official Node.js image
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root package.json for workspace configuration
COPY package.json package-lock.json* ./
# Copy frontend package.json
COPY apps/frontend/package.json ./apps/frontend/
# Copy backend package.json (needed for workspace dependency resolution)
COPY apps/backend/package.json ./apps/backend/

# Install dependencies using npm workspaces (installs all workspace dependencies)
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage (npm workspaces hoists dependencies)
COPY --from=deps /app/node_modules ./node_modules

# Copy root config files
COPY package.json turbo.json ./

# Copy frontend source code
COPY apps/frontend ./apps/frontend
# Copy backend source (needed for TypeScript type imports)
COPY apps/backend/src ./apps/backend/src
# Copy backend config files
COPY apps/backend/tsconfig.json apps/backend/package.json ./apps/backend/

# Set working directory to frontend for build
WORKDIR /app/apps/frontend

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from frontend build
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

