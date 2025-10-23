# Use Node 20 (graphql-ws requires >=20)
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# ---- Install dependencies ----
FROM base AS deps
RUN apk add --no-cache libc6-compat

# Copy only dependency files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies without running postinstall
RUN \
  if [ -f package-lock.json ]; then npm ci --ignore-scripts; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --ignore-scripts; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ---- Build stage ----
FROM base AS builder
WORKDIR /app

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build (optional)
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js app
RUN npm run build

# ---- Production image ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create app user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy only necessary build output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Run the standalone server
CMD ["node", "server.js"]
