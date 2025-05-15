# Etapa de build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa final (servidor liviano para servir el frontend)
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

# Configuración opcional para evitar errores de SPA con React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
