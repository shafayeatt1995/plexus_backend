const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Purchase, User } = require("../models");
const { objectID } = require("../utils");

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const sig = req.headers["stripe-signature"];

      const event = await stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );

      if (event.type === "checkout.session.completed") {
        const eventData = event.data.object;
        await Purchase.create(
          [
            {
              userID: objectID(eventData.metadata.userID),
              plan: eventData.metadata.plan,
              amount: eventData.amount_total,
              currency: eventData.currency,
              token: +eventData.metadata.token,
            },
          ],
          { session }
        );
        await User.updateOne(
          { _id: objectID(eventData.metadata.userID) },
          { $inc: { token: +eventData.metadata.token } },
          { session }
        );
      } else {
        console.log(`Unhandled event type ${event.type}`);
      }

      await session.commitTransaction();
      await session.endSession();
      return res.send();
    } catch (err) {
      console.error(err);
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

module.exports = router;
