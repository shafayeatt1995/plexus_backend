const { Purchase } = require("../models");
const { objectID } = require("../utils");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const controller = {
  async checkoutSession(req, res) {
    try {
      const { price } = req.body;
      let priceID;
      let plan;
      let token;
      if (price === 100) {
        priceID = "price_1SBMs3CeGFAp65Pdk84SbRdK";
        plan = "business";
        token = 100;
      } else if (price === 20) {
        priceID = "price_1SBN1YCeGFAp65PduUhI3jeE";
        plan = "professional";
        token = 20;
      } else {
        priceID = "price_1SBN1DCeGFAp65PdZnxo3g4n";
        plan = "starter";
        token = 10;
      }
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: priceID, quantity: 1 }],
        mode: "payment",
        success_url: `${process.env.BASE_URL}/payment-success`,
        cancel_url: `${process.env.BASE_URL}/payment-cancel`,
        metadata: { userID: req.user._id, plan, token },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async purchaseHistory(req, res) {
    try {
      const purchases = await Purchase.find({ userID: objectID(req.user._id) });
      res.json({ items: purchases });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = controller;
