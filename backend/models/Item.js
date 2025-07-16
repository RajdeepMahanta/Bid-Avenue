const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  startingBid: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  currentBid: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
  auctionEndTime: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
  image: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Item", ItemSchema);
