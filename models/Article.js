const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  id: String,
  title: String,
  description: String,
  url: String,
  articleDetail: mongoose.Schema.Types.Mixed,
  categoryInfo: mongoose.Schema.Types.Mixed,
  Article_category: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model("articles", ArticleSchema);
