const { Summary, User } = require("../models");
const mongoose = require("mongoose");
const { paginate, hasOne } = require("../utils");
const { summarizeText } = require("../utils/ai");

const controller = {
  async summary(req, res) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const { text, socketID } = req.body;
      const output = await summarizeText(text);

      const item = await Summary.create(
        [
          {
            userID: req.user._id,
            input: text,
            output,
          },
        ],
        { session }
      );
      await User.updateOne(
        { _id: req.user._id },
        { $inc: { tokens: -1 } },
        { session }
      );
      if (item) {
        const [summary] = await Summary.aggregate([
          { $match: { _id: item._id } },
          { $limit: 1 },
          ...hasOne("userID", "users", "user", ["name", "avatar"]),
        ]);
        global.io.to("global-room").except(socketID).emit("summary", summary);
      }

      await session.commitTransaction();
      await session.endSession();
      return res.json({ item });
    } catch (error) {
      console.error(error);
      await session.abortTransaction();
      await session.endSession();
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async fetchSummary(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const [items, total] = await Promise.all([
        Summary.aggregate([
          { $sort: { _id: -1 } },
          ...paginate(page, limit),
          ...hasOne("userID", "users", "user", ["name", "avatar"]),
        ]),
        Summary.countDocuments(),
      ]);

      return res.json({ items, total });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = controller;
