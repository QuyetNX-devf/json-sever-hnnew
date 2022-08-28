const express = require("express");
const router = express.Router();
const _ = require("lodash");

const BannerCategory = require("../models/BannerCategory");

// @router Post api/banner
// @desc Post banner
// @access Private

router.post("/", async (req, res) => {
  const { title, url, img, idCategory } = req.body;
  try {
    const newBanner = new BannerCategory({
      title,
      url,
      img,
      categoryInfor: [
        {
          id: idCategory,
        },
      ],
    });

    await newBanner.save();

    return res.json({
      success: true,
      message: "Successful banner submission",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:idCategory", async (req, res) => {
  const { idCategory } = req.params;
  try {
    const dataBanner = await BannerCategory.find();
    let bannerCategory = [...dataBanner];
    let result = [];
    if (idCategory) {
      result = _.filter(bannerCategory, {
        categoryInfor: [{ id: idCategory }],
      });
    }
    res.json({ success: true, banner: result });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
