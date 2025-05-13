# Use a modern, lightweight Node.js image
FROM node:18-alpine

# Expose app port
EXPOSE 3000

# Set environment variable
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

# Set working directory
WORKDIR /app

# Install dependencies only
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy rest of the source
COPY . .

# Default command to start the app using yarn
CMD ["yarn", "dev"]
