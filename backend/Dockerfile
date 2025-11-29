# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package config
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (bao gồm devDependencies để build)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS app
RUN npm run build

# Stage 2: Production Run
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package config và cài đặt chỉ production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built assets từ stage builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port (NestJS mặc định 3000)
EXPOSE 3000

# Script để chạy migration trước khi start app (Optional nhưng khuyến khích)
# CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
# Nếu bạn muốn chạy migration bằng tay từ local thì dùng dòng dưới:
CMD ["node", "dist/main"]