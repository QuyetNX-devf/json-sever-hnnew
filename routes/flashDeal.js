const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const authUserBuy = require("../middleware/authUserBuy");
const _ = require("lodash");

const FlashDeal = require("../models/FlashDeal");
const Products = require("../models/Products");

// @router POST api/flash-deal
// @desc POST flash deal
// @access public
router.post("/", async (req, res) => {
  const { date, product, priceDeal } = req.body;

  try {
    let productUpdate;
    const isProduct = await Products.findOne({ _id: product });
    if (!isProduct) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }

    const findDealOld = await FlashDeal.findOne({ product: product });
    if (findDealOld) {
      return res
        .status(400)
        .json({ success: false, message: "deal already exists" });
    }
    const timeDeal = new Date(date);

    productUpdate = {
      ...isProduct._doc,
      deal: {
        priceDeal,
        dateDeal: timeDeal.getTime(),
      },
    };

    productUpdate = await Products.findOneAndUpdate(
      { _id: product },
      productUpdate
    );

    const newFlashDeal = new FlashDeal({
      dateDeal: timeDeal.getTime(),
      product,
      priceDeal,
    });

    await newFlashDeal.save();

    return res.json({
      success: true,
      message: "Flashdeal create successfully",
      flashDeal: newFlashDeal,
    });
  } catch (error) {
    console.log(error);
  }
});

// @router GET api/flash-deal
// @desc GET flash deal
// @access Private
router.get("/", async (req, res) => {
  const params = req.query;
  const { limit = 10, page = 1 } = params;

  try {
    const currentDate = new Date();
    const deals = await FlashDeal.find().populate("product");
    if (!deals) {
      return res.status(404).json({ success: false, message: "not found" });
    }

    const sortDeal = deals.filter((deal) => {
      return deal.dateDeal > currentDate.getTime();
    });

    if (sortDeal.length <= 0)
      return res.status(404).json({ success: false, message: "not found" });

    const maxDateDeal = _.maxBy(deals, function (deal) {
      return deal.dateDeal;
    }).dateDeal;

    const totalRows = sortDeal.length;

    const start = (page - 1) * limit;

    const end = page * limit;

    const newProducts = sortDeal.slice(start, end);

    res.json({
      success: true,
      data: { deals: newProducts, maxDateDeal, total: totalRows },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

module.exports = router;
