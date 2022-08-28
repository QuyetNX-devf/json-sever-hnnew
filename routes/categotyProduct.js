const express = require("express");
const router = express.Router();

const CategoryProduct = require("../models/CategoryProduct");

// @router GET api/category
// @desc GET category
// @access Private

router.get("/", async (req, res) => {
  var ip = req.headers["x-forwarded-for"];

  var ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0] ||
    req.connection.remoteAddress;

  console.log(ip);
  const type = req.query.type;
  let cat;
  try {
    cat = await CategoryProduct.find();
    if (type === "featured") {
      cat = await CategoryProduct.find({ isFeatured: 1 });
    }
    res.json({ success: true, cat });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
