# Use Node.js image for building the React app
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --unsafe-perm=true

# Ensure correct permissions for react-scripts
RUN chmod +x /app/node_modules/.bin/react-scripts

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Use NGINX to serve the React app
FROM nginx:alpine

# Copy the build artifacts to the NGINX directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default HTTP port
EXPOSE 80

# Start the NGINX server
CMD ["nginx", "-g", "daemon off;"]

