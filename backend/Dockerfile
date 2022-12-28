FROM node:alpine

WORKDIR /app

COPY package-lock.json  package.json ./

COPY . .

RUN npm ci

CMD ["npm", "run", "start"]

EXPOSE 5001

