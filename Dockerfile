FROM node:16 AS builder

MAINTAINER davifeitosa.dev@protonmail.com

WORKDIR /usr/src/captaacao-api

# Install app dependencies
COPY package*.json ./
RUN npm install --only=prod

# Copy typescript configs
COPY ./tsconfig*.json /usr/src/captaacao-api/

# Copy project
COPY ./src ./src

# Typescript compile
RUN npm install typescript
RUN npm run build

EXPOSE 5050

CMD ["npm", "start"]
