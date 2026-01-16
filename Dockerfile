# Multi-stage build for checkPAD application

# Stage 1: Builder
FROM node:24.12.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runtime
FROM node:24.12.0-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files for migration scripts
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy drizzle config and migration files
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/drizzle ./drizzle

# Copy database schema
COPY --from=builder /app/src/db ./src/db

# Copy built application from builder (includes bundled dependencies)
COPY --from=builder /app/.output ./.output

# Expose the default port
EXPOSE 3000

# Create startup script that runs migrations then starts the server
RUN echo '#!/bin/sh' > /app/start.sh && \
  echo 'set -e' >> /app/start.sh && \
  echo 'echo "Running database migrations..."' >> /app/start.sh && \
  echo 'npm run db:migrate' >> /app/start.sh && \
  echo 'echo "Starting server..."' >> /app/start.sh && \
  echo 'exec node .output/server/index.mjs' >> /app/start.sh && \
  chmod +x /app/start.sh

CMD ["dumb-init", "/app/start.sh"]
