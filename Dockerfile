# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24-alpine
ARG PNPM_VERSION=10.30.3

# ---------- base ----------
FROM node:${NODE_VERSION} AS base
ARG PNPM_VERSION
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

# ---------- deps + build ----------
FROM base AS build
# Native deps for bcrypt and mongodb-memory-server binary download
RUN apk add --no-cache python3 make g++ libstdc++ curl bash
COPY package.json pnpm-lock.yaml ./
# Bring src in before install so the postinstall (tsc + asset copy) can succeed
COPY tsconfig.json ./
COPY src ./src
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- runtime ----------
FROM node:${NODE_VERSION} AS runtime
ENV NODE_ENV=production
WORKDIR /app
# Runtime libs for native modules (bcrypt)
RUN apk add --no-cache libstdc++
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["node", "./dist/server.js"]
