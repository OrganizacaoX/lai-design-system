# --- build: gera o registry (public/r) e o site de docs (dist) --------------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
# npm run build = registry:build (public/r/*.json) + vite build (dist/, que já
# inclui dist/r/*.json porque o Vite copia a pasta public/).
RUN npm run build

# --- runtime: serve dist/ com o servidor mínimo -----------------------------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY server.mjs ./
EXPOSE 8080
CMD ["node", "server.mjs"]
