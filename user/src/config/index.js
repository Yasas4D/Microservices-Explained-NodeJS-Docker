const dotEnv = require("dotenv");

const configFile = `./.env.${process.env.NODE_ENV}`;
dotEnv.config({ path: configFile });

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
  EXCHANGE_NAME: "ONLINE_SHOPPING",
  USER_BINDING_KEY: "USER_SERVICE",
  QUEUE_NAME: "USER_QUEUE",
};
