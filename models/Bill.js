const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  id: Number,
  productId: Number,
  marketPrice: Number,
  price: Number,
  price_off: Number,
  currency: String,
  sale_rules: mongoose.Schema.Types.Mixed,
  lastUpdate: String,
  warranty: String,
  productName: String,
  productSummary: String,
  productImage: mongoose.Schema.Types.Mixed,
  imageCollection: mongoose.Schema.Types.Mixed,
  productUrl: String,
  brand: mongoose.Schema.Types.Mixed,
  visit: Number,
  rating: Number,
  reviewCount: Number,
  review: mongoose.Schema.Types.Mixed,
  comment: mongoose.Schema.Types.Mixed,
  quantity: Number,
  productSKU: String,
  productModel: String,
  hasVAT: Number,
  productType: mongoose.Schema.Types.Mixed,
  categoryInfo: mongoose.Schema.Types.Mixed,
  enableDeal: Boolean,
  priceDealOff: Number,
  deal: {
    priceDeal: Number,
    dateDeal: Number,
    _id: Schema.Types.ObjectId,
  },
  inCart: {
    total: Number,
    count: Number,
  },
});

const billSchema = new Schema({
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  phone: {
    type: Number,
  },
  payMethod: String,
  note: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  totaBill: Number,
  skuOrder: String,
  products: [ProductsSchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("bill", billSchema);
