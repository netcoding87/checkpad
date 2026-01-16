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

# Copy built application from builder (includes bundled dependencies)
COPY --from=builder /app/.output ./.output

# Expose the default port
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
