FROM node:18-alpine AS base

# Install Turbo globally
RUN npm install -g turbo

# First stage: Prune monorepo
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune frontend --docker

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
RUN npm run build -- --filter=frontend...

# Final stage: Production image
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Copy nginx configuration
COPY --from=builder /app/apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=installer /app/apps/frontend/.next/static ./_next/static
COPY --from=installer /app/apps/frontend/public ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]