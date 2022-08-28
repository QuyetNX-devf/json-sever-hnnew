const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Products = require("../models/Products");
const Rate = require("../models/Rate");
const _ = require("lodash");
const authUserBuy = require("../middleware/authUserBuy");

// @router POST api/rate
// @desc rate
// @access Public
router.post("/", authUserBuy, async (req, res) => {
  const {
    item_type,
    idProduct,
    people_like_count,
    people_dislike_count,
    reply_count,
    is_user_admin,
    user_avatar,
    user_name,
    rate,
    title,
    content,
    files,
    approved,
    post_time = new Date().getTime(),
    counter,
    replies = [],
  } = req.body;

  try {
    const userId = req.userId;
    let infoUser;
    if (userId) {
      const user = await User.findOne({ _id: userId });
      infoUser = user.info;
    }
    const product = await Products.findOne({ id: idProduct });

    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "Product does not exist" });

    const newRate = new Rate({
      item_type,
      idProduct,
      people_like_count,
      people_dislike_count,
      reply_count,
      is_user_admin,
      user_avatar,
      user_name: infoUser ? infoUser.userName : user_name,
      rate,
      title,
      content,
      files,
      approved,
      post_time,
      counter,
      replies: [],
    });

    await newRate.save();

    return res.json({
      success: true,
      message: "Submit comment successfully",
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id", async (req, res) => {
  const idProduct = req.params.id;
  const { limit = 15 } = req.query;
  if (!idProduct) {
    return res
      .status(400)
      .json({ success: false, message: "product id required!" });
  }
  try {
    const rate = await Rate.find({ idProduct: +idProduct });
    return res.json({ success: true, rate: rate ? rate : [] });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

router.put("/reply", async (req, res) => {
  const {
    id = _.uniqueId(),
    idRate,
    content,
    user_name,
    post_time = new Date().getTime(),
  } = req.body;

  if (!idRate) {
    return res
      .status(400)
      .json({ success: false, message: "rate id required!" });
  }

  try {
    const rate = await Rate.findOne({ _id: idRate });
    if (!rate) {
      return res.status(401).json({
        success: false,
        message: "Not found worthwhile",
      });
    }
    const replies = rate.replies;
    const newRate = {
      ...rate._doc,
      replies: [
        ...replies,
        {
          id,
          idRate,
          content,
          user_name,
          post_time,
        },
      ],
    };
    await Rate.findOneAndUpdate({ _id: idRate }, newRate);

    res.json({ success: true, newRate });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
