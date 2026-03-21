# Build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Accept the variable from GitHub Actions
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the app (Vite will now bake the URL into the static files)
RUN npm run build

# Serve with Nginx (Lightweight & Fast)
FROM nginx:alpine

# Copy the custom Nginx config for React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Vite builds to the 'dist' folder by default
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]