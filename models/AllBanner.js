const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BannerSchema = new Schema({
  banner_homepage: mongoose.Schema.Types.Mixed,
  banner_category: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model("bannerProducts", BannerSchema);
