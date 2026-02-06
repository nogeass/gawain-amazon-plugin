# syntax=docker/dockerfile:1

FROM node:20-slim AS base

WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

COPY package.json package-lock.json* ./
RUN npm ci

# Development/Demo image
FROM base AS runner

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create .local directory for install_id
RUN mkdir -p .local

ENV NODE_ENV=production

CMD ["npm", "run", "demo", "--", "--product", "./samples/product.sample.json"]
