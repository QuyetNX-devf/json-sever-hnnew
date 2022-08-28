const express = require("express");
const router = express.Router();
const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

// @router GET api/accout
// @desc GET accout
// @access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    res.json({ success: true, user: { id: user._id, ...user.info } });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

// @router PUT api/accout
// @desc UPDATE accout
// @access Private
router.put("/", verifyToken, async (req, res) => {
  const {
    userName,
    address,
    age,
    phone,
    newPassword,
    oldPassword,
    email,
    avatar,
  } = req.body;
  // if (!userName)
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "username is required" });

  try {
    let updateUser;
    const user = await User.findOne({ _id: req.userId });
    const checkUser = await User.findOne({ account: email });
    if (checkUser && user.account !== email)
      return res.status(400).json({
        success: false,
        er: [user.account, email],
        message: "account already taken",
      });
    if (newPassword && oldPassword) {
      const passwordValid = await argon2.verify(user.password, oldPassword);
      if (!passwordValid) {
        return res
          .status(400)
          .json({ success: false, message: "old password is incorrect" });
      }
      const hashedPassword = await argon2.hash(newPassword);
      updateUser = {
        password: hashedPassword,
        info: {
          userName: userName || user.info.userName,
          address: address || user.info.address,
          age: age || user.info.age,
          phone: phone || user.info.phone,
          email: email || user.info.email,
          avatar: avatar || user.info.avatar,
        },
      };
    } else {
      updateUser = {
        account: email || user.account,
        info: {
          userName: userName || user.info.userName,
          address: address || user.info.address,
          age: age || user.info.age,
          phone: phone || user.info.phone,
          email: email || user.info.email,
          avatar: avatar || user.info.avatar,
        },
      };
    }

    updateUser = await User.findOneAndUpdate({ _id: req.userId }, updateUser);
    if (!updateUser)
      return res.status(401).json({
        success: false,
        message: "Account not found or user not authorised",
      });
    res.json({
      success: true,
      user: {
        id: updateUser._id,
        userName: userName || user.info.userName,
        address: address || user.info.address,
        age: age || user.info.age,
        phone: phone || user.info.phone,
        email: email || user.info.email,
        avatar: avatar || user.info.avatar,
      },
      message: "Update successfulsss",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

module.exports = router;
