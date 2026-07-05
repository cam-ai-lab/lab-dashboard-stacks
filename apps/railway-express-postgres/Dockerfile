FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /workspace
COPY . .
RUN pnpm install --frozen-lockfile && pnpm --filter railway-express-postgres build
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /workspace/apps/railway-express-postgres/dist ./dist
USER node
CMD ["node", "dist/server.js"]
