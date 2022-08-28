const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductLikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
  },
  product: {
    type: Number,
    ref: "products",
  },
});

module.exports = mongoose.model("productLike", ProductLikeSchema);
