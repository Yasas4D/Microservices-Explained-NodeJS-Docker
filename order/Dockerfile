FROM node:16-alpine3.15

WORKDIR /app/order

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8003

CMD [ "npm", "start"]
