FROM node:slim
RUN apt-get update -y \
&& apt-get install -y openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]