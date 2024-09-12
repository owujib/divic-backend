# Stage 1: Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production Stage
FROM node:20-alpine AS runner

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install only production dependencies
COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Run the NestJS application
CMD ["node", "dist/main"]
