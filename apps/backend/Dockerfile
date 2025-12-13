# Use the official Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files for better layer caching
COPY package.json ./
COPY bun.lock* ./

# Install dependencies
RUN bun install

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy source code
COPY . .

# Set environment variables before build to ensure correct configuration
ENV NODE_ENV=production
ENV PORT=3002

# Build the application
RUN bun run build

# Expose the port the app runs on
EXPOSE 3002

# Start the application
CMD ["bun", "run", "start"]
