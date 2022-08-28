const express = require("express");
const router = express.Router();
const _ = require("lodash");

const AllBanner = require("../models/AllBanner");

// @router GET api/banner
// @desc GET banner
// @access Private

router.get("/homepage", async (req, res) => {
  try {
    banner = await AllBanner.find();
    res.json({ success: true, banner: banner[0]["banner_homepage"] });
  } catch (error) {
    console.log(error);
  }
});
router.get("/category", async (req, res) => {
  const idCategory = req.query.idCategory;
  try {
    const dataBanner = (await AllBanner.find())[0]["banner_category"];
    let bannerCategory = [...dataBanner];

    if (idCategory) {
      bannerCategory = _.filter(bannerCategory, {
        categoryInfo: [{ id: idCategory }],
      });
    }
    res.json({ success: true, banner: bannerCategory });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
