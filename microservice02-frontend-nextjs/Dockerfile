# Use an official Node image to build the app
FROM node:18 AS build

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install

# Copy the rest of the frontend app source
COPY . .

# Build the app for production (includes export with Next.js 15+)
RUN npm run build

# ---- Serve the production build using a minimal web server ----
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the previous stage
COPY --from=build /app/out /usr/share/nginx/html

# Use custom nginx config to listen on port 3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
