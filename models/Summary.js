const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SummarySchema = new Schema(
  {
    userID: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    input: { type: String, required: true },
    output: { type: String, required: true },
  },
  {
    strict: true,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("Summary", SummarySchema);
