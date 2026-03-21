FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
# Added --ignore-scripts to prevent execution of malicious pre/post install scripts
RUN npm install --ignore-scripts

COPY . .

# Expose port
EXPOSE 5173

# Start app
CMD ["npm", "run", "dev"]