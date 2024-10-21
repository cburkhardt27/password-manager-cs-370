FROM node:16-alpine

WORKDIR /app

# Copy only package.json and package-lock.json to install dependencies
COPY package*.json ./

RUN npm install

# Copy all other project files to the container
COPY . .

# Expose the development server port
EXPOSE 3000

CMD ["npm", "start"]