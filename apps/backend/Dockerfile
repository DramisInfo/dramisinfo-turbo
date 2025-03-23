FROM node:18-alpine AS base

# Build stage
FROM base AS installer
WORKDIR /app
# Copy only the pruned package.json files and install dependencies
COPY json/ .
COPY package-lock.json ./package-lock.json
RUN npm install

# Copy source code and build
COPY full/ .
RUN npm run build

# Final stage: Production image
FROM node:18-alpine AS runner
WORKDIR /app
# Install production dependencies
COPY --from=installer /app/apps/backend/package.json ./package.json
COPY --from=installer /app/apps/backend/dist ./dist
RUN npm install --omit=dev

# Create and switch to non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    && chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3001
CMD ["node", "dist/index.js"]