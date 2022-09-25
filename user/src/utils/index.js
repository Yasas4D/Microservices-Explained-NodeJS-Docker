const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");
const {
  APP_SECRET,
  EXCHANGE_NAME,
  MESSAGE_BROKER_URL,
  QUEUE_NAME,
  USER_BINDING_KEY,
} = require("../config");

//Utility functions
(module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
}),
  (module.exports.GeneratePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
  });

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

(module.exports.GenerateSignature = async (payload) => {
  return await jwt.sign(payload, APP_SECRET, { expiresIn: "2h" });
}),
  (module.exports.ValidateSignature = async (req) => {
    const signature = req.get("Authorization");

    if (signature) {
      const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
      req.user = payload;
      return true;
    }

    return false;
  });

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

/*----------------Message broker configs-----------*/

//create a channel
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    return channel;
  } catch (error) {
    throw error;
  }
};

//subscribe to message broker
module.exports.SubscribeToMessage = async (channel, service) => {
  try {
    const appQueue = await channel.assertQueue(QUEUE_NAME);
    await channel.bindQueue(appQueue.queue, EXCHANGE_NAME, USER_BINDING_KEY);
    await channel.consume(appQueue.queue, (data) => {
      console.log("---recieved data in user service-----");
      console.log(data.content.toString());
      service.SubscribeEvents(data.content.toString());
      channel.ack(data);
    });
  } catch (error) {
    throw error;
  }
};
