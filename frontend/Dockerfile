# Use a Node.js image to build the frontend
FROM node:lts-alpine AS builder

# Set the working directory
WORKDIR /app

# Install dependencies and build the frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use Nginx to serve the built files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for the frontend
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
