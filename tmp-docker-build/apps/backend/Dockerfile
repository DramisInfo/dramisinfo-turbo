FROM node:18-alpine AS base

# Setup base stage for caching
FROM base AS builder
WORKDIR /app

# Copy pruned package.json files and lockfile from json/ directory
COPY json/ .
# Install dependencies - cache layer will be reused if dependencies don't change
RUN npm ci

# Copy source files from full/ directory
COPY . .

# Build the application using turbo
RUN npx turbo run build --filter=backend...

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Install production dependencies only
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/backend/package*.json ./apps/backend/
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

EXPOSE 3001
CMD ["node", "apps/backend/dist/index.js"]