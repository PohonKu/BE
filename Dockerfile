FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install semua dependencies (termasuk devDependencies untuk build)
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy semua source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 2000

# Start: otomatis migrate lalu jalankan server
CMD ["npm", "run", "start"]