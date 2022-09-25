FROM node:16-alpine3.15

WORKDIR /app/user

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8001

CMD [ "npm", "start"]
