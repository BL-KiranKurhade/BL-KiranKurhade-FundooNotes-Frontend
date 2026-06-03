# Stage 1: Build the React application using Node
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Pass in the API URL as an argument so Vite can embed it during the build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine
# Copy the built React app to Nginx's web root
COPY --from=build /app/dist /usr/share/nginx/html
# Add a custom Nginx configuration to handle React Router (Single Page Application)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
