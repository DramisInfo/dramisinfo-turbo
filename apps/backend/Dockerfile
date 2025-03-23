FROM node:18-alpine AS base

# Install Turbo globally
RUN npm install -g turbo

# First stage: Prune monorepo
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune backend --docker

# Second stage: Install dependencies
FROM base AS installer
WORKDIR /app

# Install dependencies for the app plus peer dependencies
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

# Third stage: Build the application
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npm run build -- --filter=backend...

# Final stage: Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Install production dependencies first as root
COPY --from=installer /app/apps/backend/package.json ./package.json
COPY --from=installer /app/apps/backend/dist ./dist
RUN npm install --omit=dev

# Then create and switch to non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    && chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3001
CMD ["node", "dist/index.js"]