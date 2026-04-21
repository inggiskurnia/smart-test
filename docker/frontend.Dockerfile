# docker/frontend.Dockerfile
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json turbo.json ./
COPY apps/frontend/package*.json apps/frontend/

RUN npm install

COPY . .
RUN npx turbo run build --filter=frontend...

FROM nginx:alpine
COPY docker/nginx.frontend.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
