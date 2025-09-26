const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const controller = {
  async checkoutSession(req, res) {
    try {
      const { price } = req.body;
      let priceID;
      if (price === "100") {
        priceID = "price_1SBMs3CeGFAp65Pdk84SbRdK";
      } else if (price === "20") {
        priceID = "price_1SBN1YCeGFAp65PduUhI3jeE";
      } else {
        priceID = "price_1SBN1DCeGFAp65PdZnxo3g4n";
      }
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: priceID, quantity: 1 }],
        mode: "payment",
        success_url: `${process.env.BASE_URL}/payment-success`,
        cancel_url: `${process.env.BASE_URL}/payment-cancel`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = controller;
