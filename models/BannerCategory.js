const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BannerCategorySchema = new Schema({
  img: String,
  title: String,
  url: String,
  categoryInfor: [
    {
      id: String,
    },
  ],
});

module.exports = mongoose.model("bannerCategory", BannerCategorySchema);
