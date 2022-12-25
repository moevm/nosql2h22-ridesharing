FROM node:14.20.1-buster
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5001