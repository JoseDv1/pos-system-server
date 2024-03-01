FROM node:21-slim
RUN apt-get update -y && apt-get install -y openssl


# Create app directory
WORKDIR /server

# Install app dependencies
COPY package*.json ./

# Install dependencies
RUN npm install


# Bundle app source
COPY . .

# Generate Prisma clientc
RUN npx prisma generate

# Set environment variables
ENV DATABASE_URL=postgres://postgres:possystem1001446301!@localhost:5432/pos_system_db

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]

