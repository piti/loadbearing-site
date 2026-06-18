# --- build stage: render the Astro site (Node adapter, standalone) ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

# --- serve stage: run the Node server (NOT static-only) ---
# Standalone server serves the prerendered pages AND the on-demand routes
# (/api/signup, the hidden /kit/* assets). Secrets come from runtime env only.
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Reward assets live OUTSIDE the public/ tree so they are never served
# un-gated; the /kit/* endpoints read them and attach noindex headers.
COPY --from=build /app/kit-assets ./kit-assets
COPY package.json ./
EXPOSE 80
CMD ["node", "./dist/server/entry.mjs"]
