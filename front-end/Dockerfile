FROM node:18.12-alpine

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY ./front-app/package.json ./

RUN npm install
