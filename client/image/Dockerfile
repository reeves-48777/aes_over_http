FROM node:lts-alpine3.20

USER node

EXPOSE 80

WORKDIR /home/node/app

COPY package*.json /home/node/app/

RUN npm install