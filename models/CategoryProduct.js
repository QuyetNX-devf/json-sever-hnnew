const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoryProductsSchema = new Schema({
  id: String,
  name: String,
  url: String,
  summary: String,
  type: String,
  isParent: Number,
  isFeatured: Number,
  thumbnail: mongoose.Schema.Types.Mixed,
  children: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model("categoryProducts", CategoryProductsSchema);
