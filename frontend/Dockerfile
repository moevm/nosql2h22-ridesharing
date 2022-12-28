FROM node:alpine

WORKDIR /app

COPY package-lock.json  package.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
