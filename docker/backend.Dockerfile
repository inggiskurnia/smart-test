# Stage 1: Setup NPM and install dependencies
FROM node:22-alpine AS builder

WORKDIR /app

# Install root deps (Turborepo at root)
COPY package*.json turbo.json ./
COPY apps/backend/package*.json apps/backend/
COPY apps/backend/.env apps/backend/

RUN npm install
COPY . .

RUN npx turbo run build --filter=backend...

# Stage 2: Runtime Container
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/apps/backend/.env ./
COPY --from=builder /app/apps/backend/storage/app/credential.json /app/storage/app/credential.json

RUN npm install --omit=dev

EXPOSE 8091
CMD ["node", "dist/src/main"]
