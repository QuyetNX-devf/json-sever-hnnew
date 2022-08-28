const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const _ = require("lodash");

const Products = require("../models/Products");
const ProductLike = require("../models/ProductLike");
const User = require("../models/User");

// @router POST api/like-product
// @desc POST like product
// @access public
router.post("/", verifyToken, async (req, res) => {
  const { idProduct } = req.body;
  const userId = req.userId;

  try {
    const isProduct = await Products.findOne({ id: idProduct });
    if (!isProduct) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }

    const pdLiked = await ProductLike.findOne({ product: +idProduct });
    if (pdLiked) {
      return res
        .status(400)
        .json({ success: false, message: "Already liked the product" });
    }

    const newPdLike = new ProductLike({
      user: userId,
      product: idProduct,
    });

    await newPdLike.save();

    return res.json({
      success: true,
      message: "productLike create successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

// @router GET api/like-product
// @desc GET like product
// @access public
router.get("/", verifyToken, async (req, res) => {
  const userId = req.userId;

  const params = req.query;
  const { limit = 10, page = 1 } = params;

  try {
    const newLikePds = [];
    const likePds = await ProductLike.find({ user: userId });

    if (!likePds) {
      return res.status(404).json({ success: false, message: "not found" });
    }

    for (const likePd of likePds) {
      const newLikePd = await Products.findOne({
        id: likePd.product,
      });
      if (newLikePd) {
        newLikePds.push(newLikePd);
      }
    }

    const totalRows = newLikePds.length;

    const start = (page - 1) * limit;

    const end = page * limit;

    const newProducts = newLikePds.slice(start, end);

    return res.json({
      success: true,
      total: totalRows,
      products: newProducts,
      message: "productLike create successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;
  if (typeof +productId != "number") {
    return res.json({ success: false, message: "pd not found" });
  }
  try {
    const liked = await ProductLike.findOne({ product: +productId });
    if (!liked) {
      return res.status(404).json({ success: true, message: "not found" });
    }
    const product = await Products.findOne({ id: +productId });
    if (product) {
      return res.json({ success: true, product, message: "" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/", verifyToken, async (req, res) => {
  const { productId } = req.body;
  try {
    const deleteProduct = await ProductLike.findOneAndDelete({
      product: +productId,
    });
    if (!deleteProduct) {
      return res.status(404).json({ success: false, message: "not found..." });
    }
    res.json({ success: true, message: "product deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

module.exports = router;
