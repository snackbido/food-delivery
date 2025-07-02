# ⛏ Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy toàn bộ project và build
COPY . .
RUN npm run build

# 🐳 Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

# Copy code đã biên dịch và module production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 5007
CMD ["node", "dist/main"]