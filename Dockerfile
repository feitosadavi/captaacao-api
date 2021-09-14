FROM node:14
WORKDIR /usr/src/car-pet-api
COPY ./package.json .
RUN npm install --only=prod
