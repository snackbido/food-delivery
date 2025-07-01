# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install -g @nestjs/cli
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps
EXPOSE 5004
CMD ["node", "dist/main"]
