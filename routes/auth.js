const express = require("express");
const router = express.Router();
const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

// @router POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  const { account, password, userName, age, address, phone, email } = req.body;

  if (!account || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/ or password" });
  }
  try {
    const user = await User.findOne({ account });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "UserName already taken" });

    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      account,
      password: hashedPassword,
      info: { userName, age, address, phone, email: account },
    });

    await newUser.save();

    //return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({
      success: true,
      message: "User create successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
  }
});

// @router POST api/auth/register
// @desc Register user
// @access Public
router.post("/login", async (req, res) => {
  const { account, password } = req.body;

  if (!account || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/ or password" });
  }
  try {
    // check for existing user
    const user = await User.findOne({ account });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password " });
    }

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password " });
    }

    //return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({
      success: true,
      message: "User logged in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
