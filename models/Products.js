const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dealSchema = new Schema({
  priceDeal: Number,
  dateDeal: Number,
});
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
  deal: dealSchema,
});

module.exports = mongoose.model("products", ProductsSchema);
