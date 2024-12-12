# Use Node.js image to run the backend
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install

# Copy the backend source code
COPY . .

# Expose the port the backend runs on
EXPOSE 5000

# Start the backend server
CMD ["node", "src/server.js"]
