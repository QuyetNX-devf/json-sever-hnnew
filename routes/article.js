const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Article = require("../models/Article");

// @router GET api/article
// @desc GET article
// @access Private

router.get("/", async (req, res) => {
  const params = req.query;
  const { type, limit = 10, page = 1, idCategory } = params;
  try {
    article = await Article.find();
    let listArticle = [...article];
    if (idCategory) {
      listArticle = _.filter(listArticle, {
        categoryInfo: [{ id: idCategory }],
      });
    }

    if (type === "featured") {
      listArticle = listArticle.filter(
        (article) => article.articleDetail.isFeatured === 1
      );
    }

    if (type === "new") {
      listArticle = listArticle.sort(
        (a, b) => +b.articleDetail.createDate - +a.articleDetail.createDate
      );
    }

    if (type === "visit") {
      listArticle = listArticle.sort(
        (a, b) => +b.articleDetail.visit - +a.articleDetail.visit
      );
    }

    const totalRows = listArticle.length;

    const start = (page - 1) * limit;

    const end = page * limit;

    const newArticle = listArticle.slice(start, end);

    res.json({ success: true, article: newArticle, total: totalRows });
  } catch (error) {
    console.log(error);
  }
});

router.get("/detail/:idArticle", async (req, res) => {
  const params = req.params;
  const { idArticle } = params;

  if (!idArticle) {
    return res
      .status(400)
      .json({ success: false, message: "requires article id" });
  }
  try {
    const isArticle = await Article.findOne({ id: idArticle });
    if (!isArticle) {
      return res
        .status(404)
        .json({ success: false, message: "No article found" });
    }
    res.json({ success: true, article: isArticle });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

module.exports = router;
