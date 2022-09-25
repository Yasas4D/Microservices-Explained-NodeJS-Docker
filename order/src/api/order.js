const { USER_BINDING_KEY } = require("../config");
const OrderService = require("../services/order-service");
const { SubscribeToMessage, PublishMessage } = require("../utils");
const UserAuth = require("./middlewares/auth");

module.exports = (app, channel) => {
  const service = new OrderService();
  SubscribeToMessage(channel, service);

  app.post("/order", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { txnNumber } = req.body;

    try {
      const { data } = await service.PlaceOrder({ _id, txnNumber });

      const payload = await service.GetOrderPayload(_id, data, "CREATE_ORDER");

      PublishMessage(channel, USER_BINDING_KEY, JSON.stringify(payload));

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/orders", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const { data } = await service.GetOrders(_id);

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const { data } = await service.getCart({ _id });

      return res.status(200).json(data);
    } catch (err) {
      throw err;
    }
  });
};
