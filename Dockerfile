# Etapa 1: Build del Frontend (React + Vite + Tailwind + TypeScript)
FROM node:20-alpine AS frontend-builder
WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . .
RUN npm run build

# Etapa 2: Servidor de Producción Node.js (Express + API + SPA)
FROM node:20-alpine
WORKDIR /app

# Instalar dependencias del backend
COPY server/package*.json ./server/
RUN cd server && (npm ci --omit=dev || npm install --production)

# Copiar archivos del backend
COPY server/ ./server/

# Copiar build del frontend
COPY --from=frontend-builder /app/dist ./dist

# Configuración de entorno
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server/server.js"]
