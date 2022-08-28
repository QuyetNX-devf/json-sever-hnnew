const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RateSchema = new Schema({
  id: String,
  item_type: String,
  idProduct: Number,
  people_like_count: String,
  people_dislike_count: String,
  reply_count: String,
  is_user_admin: String,
  user_avatar: String,
  user_name: String,
  rate: String,
  rate: String,
  title: String,
  content: String,
  files: mongoose.Schema.Types.Mixed,
  approved: String,
  post_time: String,
  post_time: String,
  counter: String,
  counter: String,
  replies: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model("rate", RateSchema);
