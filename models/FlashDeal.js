const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FlashDealSchema = new Schema({
  dateDeal: {
    type: Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
  },
  priceDeal: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("flashDeal", FlashDealSchema);
