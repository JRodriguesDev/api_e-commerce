FROM node:20.19.5-slim
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN npx prisma generate
CMD ["npm", "start"]