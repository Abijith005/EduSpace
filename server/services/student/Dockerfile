FROM node:18.17.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5020

CMD ["npm","start"]