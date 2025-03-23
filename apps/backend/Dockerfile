FROM node:18-alpine AS base

# Build stage
FROM base AS installer
WORKDIR /app
# Copy only the pruned package.json files and install dependencies
COPY json/ .
COPY package-lock.json ./package-lock.json
RUN npm ci

# Final stage: Production image
FROM node:18-alpine AS runner
WORKDIR /app
# Install production dependencies
COPY --from=installer /app/apps/backend/package.json ./package.json
COPY dist/ ./dist
RUN npm ci --omit=dev

# Check if pre-built dist exists, otherwise build
COPY dist/ ./dist
RUN if [ ! -d "./dist" ]; then npm run build; fi

# Create and switch to non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    && chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3001
CMD ["node", "dist/index.js"]