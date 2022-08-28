const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
router.get("/", (req, res) => {
  res.send("day la router post");
});

module.exports = router;
