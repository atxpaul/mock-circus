# Stage 1: Build (Install dependencies)
FROM node:20.12.2-alpine3.19 AS build

ENV NODE_ENV production

# Create the working directory and set ownership
RUN mkdir -p /app && chown -R node:node /app && chmod -R 770 /app
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker cache
COPY --chown=node:node package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Stage 2: Production
FROM node:20.12.2-alpine3.19 AS production

ENV NODE_ENV production

# Create the working directory and set ownership
RUN mkdir -p /app && chown -R node:node /app && chmod -R 770 /app
WORKDIR /app

# Copy dependencies from the build stage
COPY --from=build /app/node_modules ./node_modules

# Copy the application source code
COPY --chown=node:node . .

# Expose the application port
EXPOSE 3000

# Switch to non-root user
USER node

# Command to start the app
CMD ["node", "src/app.js"]
