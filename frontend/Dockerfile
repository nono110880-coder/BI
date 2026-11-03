# Multi-stage Dockerfile to build a Vite (Vue) app and serve with Nginx
# Stage 1: Build the frontend using Node
FROM node:20-alpine AS builder
WORKDIR /app
# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci
# Copy source files
COPY . .
# Build for production (Vite creates a `dist` folder)
RUN npm run build

# Stage 2: Serve the built assets with Nginx
FROM nginx:alpine
# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*
# Copy the built `dist` folder from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: copy a custom nginx config (if needed)
#COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
