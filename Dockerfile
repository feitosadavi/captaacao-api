FROM node:12

MAINTAINER davifeitosa.dev@protonmail.com

WORKDIR /usr/src/captaacao-api

# Install app dependencies
COPY package*.json ./
RUN npm install --only=prod

# Bundle app source
COPY . .

# Typescript compile
RUN npm install -g tsc
RUN npm run build

EXPOSE 5050

CMD ["npm", "start"]
