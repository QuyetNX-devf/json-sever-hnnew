const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoryAticleSchema = new Schema({
  id: String,
  title: String,
  parentId: Number,
  isParent: Number,
  thumbnail: String,
  type: String,
  url: String,
  item_count: Number,
  children: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model("categoryAticle", CategoryAticleSchema);
