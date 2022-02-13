FROM node:12

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

RUN rm -rf src
RUN npm uninstall typescript

EXPOSE 5050

CMD ["npm", "start"]
