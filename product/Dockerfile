FROM node:16-alpine3.15

WORKDIR /app/product

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8002

CMD [ "npm", "start"]
