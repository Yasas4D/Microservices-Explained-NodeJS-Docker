const UserService = require("../services/user-service");
const UserAuth = require("./middlewares/auth");
const { SubscribeToMessage } = require("../utils");

module.exports = (app, channel) => {
  const service = new UserService();
  SubscribeToMessage(channel, service);

  app.post("/signup", async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      const { data } = await service.SignUp({ email, password, phone });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { data } = await service.SignIn({ email, password });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/shoping-details", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetShopingDetails(_id);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/wishlist", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetWishList(_id);
      return res.status(200).json({ results: data });
    } catch (err) {
      next(err);
    }
  });
};
