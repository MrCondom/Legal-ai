FROM node:20-bullseye-slim AS builder

# Create working directory
WORKDIR /app
RUN apt-get update && apt-get install -y \
git \
openssl \
libssl-dev \
ca-certificates \
&& rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build


FROM node:20-bullseye-slim
WORKDIR /app
RUN apt-get update && apt-get install -y \
git \
openssl \
libssl-dev \
ca-certificates \
&& rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN npx prisma generate
COPY --from=builder /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 8080
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
