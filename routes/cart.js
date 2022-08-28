const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Products = require("../models/Products");
const CategoryProduct = require("../models/CategoryProduct");

// @router post api/cart
// @desc post cart
// @access Private

router.post("/add", async (req, res) => {
  const { payload } = req.body;

  // loaị các id trùng nhau
  const listProduct = _.uniqBy(payload, function (product) {
    return product.id;
  });

  let listProductInCart = [];
  let message;

  try {
    for (const product of listProduct) {
      let infoProduct = await Products.findOne({ id: +product.id });
      if (infoProduct) {
        const countCart = parseInt(product.count);
        let totalPrice = countCart * infoProduct.price;
        let enableDeal = false;
        const currentTime = new Date().getTime();
        if (infoProduct.deal) {
          if (infoProduct.deal.dateDeal - currentTime > 0) {
            enableDeal = true;
            totalPrice = countCart * infoProduct.deal.priceDeal;
          } else {
            enableDeal = false;
          }
        }
        const newProduct = {
          ...infoProduct._doc,
          countCart: countCart,
          totalCart: totalPrice,
          enableDeal,
        };
        listProductInCart.push(newProduct);
      } else {
        message = `${product.id} product not found`;
      }
    }
    if (listProductInCart.length > 0) {
      return res.json({
        success: true,
        cart: listProductInCart,
        message: message ? message : "200 ok",
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Unexpected error on the server" });
  }
});

module.exports = router;
