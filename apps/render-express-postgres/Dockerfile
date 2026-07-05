FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /workspace
COPY . .
RUN pnpm install --frozen-lockfile && pnpm --filter render-express-postgres build
FROM node:22-alpine
ENV NODE_ENV=production PORT=10000
WORKDIR /app
COPY --from=build /workspace/apps/render-express-postgres/dist ./dist
EXPOSE 10000
USER node
CMD ["node", "dist/server.js"]
