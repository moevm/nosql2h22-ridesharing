FROM node:14.20.1-buster
WORKDIR /frontend
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000