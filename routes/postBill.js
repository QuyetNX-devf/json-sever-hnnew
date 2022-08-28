const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const authUserBuy = require("../middleware/authUserBuy");

const Bill = require("../models/Bill");
const Products = require("../models/Products");

// @router GET api/bill/id
// @desc GET bill
// @access Private
router.get("/:idBill", verifyToken, async (req, res) => {
  const { idBill } = req.params;
  try {
    let bills;
    if (idBill) {
      bills = await Bill.find({ user: req.userId, skuOrder: idBill }).populate(
        "user",
        ["info"]
      );
    }

    if (!bills) {
      return res.status(404).json({ success: false, message: "not found" });
    }

    res.json({ success: true, bills: bills[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

// @router GET api/bill/send-cart/:orderId
// @desc GET send-cart/:orderId
// @access Private
router.get("/send-cart/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    let bills;
    if (orderId) {
      bills = await Bill.find({ skuOrder: orderId });
    }

    if (!bills) {
      return res.status(404).json({ success: false, message: "not found" });
    }

    res.json({ success: true, bills: bills[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

// @router GET api/bills
// @desc GET bill
// @access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.userId }).populate("user", [
      "info",
    ]);

    if (!bills) {
      return res.status(404).json({ success: false, message: "not found" });
    }

    res.json({ success: true, bills });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

// @router POST api/bill
// @desc POST bill
// @access public
router.post("/", authUserBuy, async (req, res) => {
  const { address, emall, name, phone, products, payMethod, note } = req.body;

  const skuOrder = () => {
    const a = Math.random();
    return Math.ceil(a * 10000);
  };
  if (!products) {
    return res
      .status(400)
      .json({ success: false, message: "There are no products in the cart" });
  }
  try {
    let totaBill = 0;
    let productInBill = [];
    for (product of products) {
      let infoProduct = await Products.findOne({ id: +product.id });
      let enableDeal = false;
      let priceDealOff = 0;
      if (infoProduct.deal) {
        const deal = infoProduct.deal;
        const currentDate = new Date();
        const dateDeal = deal.dateDeal;
        enableDeal = dateDeal - currentDate > 0 ? true : false;
        if (enableDeal) {
          priceDealOff = Math.floor(
            ((infoProduct.price - deal.priceDeal) / infoProduct.price) * 100
          );
        }
      }
      if (infoProduct) {
        infoProduct = {
          ...infoProduct._doc,
          enableDeal,
          priceDealOff,
          inCart: {
            count: product.count,
            total:
              product.count *
              (enableDeal ? infoProduct.deal.priceDeal : infoProduct.price),
          },
        };
        productInBill.push(infoProduct);
      }
    }

    if (productInBill.length > 0) {
      for (product of productInBill) {
        totaBill = totaBill + product.inCart.total;
      }
    }

    const newBill = new Bill({
      address,
      emall,
      name,
      phone,
      totaBill,
      payMethod,
      note,
      skuOrder: `${skuOrder()}`,
      products: productInBill,
      user: req.userId,
    });

    await newBill.save();

    return res.json({
      success: true,
      message: "User create successfully",
      bill: newBill,
    });
  } catch (error) {
    console.log(error);
  }
});

// @router DETELE api/bill
// @desc detele bill
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const billDeleteConditon = { _id: req.params.id, user: req.userId };
    const deteleBill = await Bill.findOneAndDelete(billDeleteConditon);
    if (!deteleBill)
      return res.status(401).json({
        success: false,
        message: "Bill not found or user not authorised",
      });
    res.json({ success: true, bill: deteleBill });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

module.exports = router;
