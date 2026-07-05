FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /workspace
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter cloud-run-container-express build

FROM node:22-alpine
ENV NODE_ENV=production PORT=8080
WORKDIR /app
COPY --from=build /workspace/apps/cloud-run-container-express/dist ./dist
EXPOSE 8080
USER node
CMD ["node", "dist/server.js"]
