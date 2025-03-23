FROM node:18-alpine AS base

# Install dependencies and build
FROM base AS installer
WORKDIR /app
# Copy only the pruned package.json files and install dependencies
COPY json/ .
COPY package-lock.json ./package-lock.json
RUN npm ci

# Copy source code and build
COPY full/ .
# Check if pre-built .next exists, otherwise build
COPY .next/ ./.next
RUN if [ ! -d "./.next" ]; then npm run build; fi

# Final stage: Production image
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html
# Copy nginx configuration from full source
COPY --from=installer /app/apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
# Copy built assets
COPY --from=installer /app/apps/frontend/.next/static ./_next/static
COPY --from=installer /app/apps/frontend/public ./
COPY .next/ ./.next
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]