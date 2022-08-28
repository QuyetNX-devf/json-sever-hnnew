const fs = require("fs");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const posts = require("./routes/posts");

const authRouter = require("./routes/auth");
const billRouter = require("./routes/postBill");
const accountRouter = require("./routes/account");
const categoryProductRouter = require("./routes/categotyProduct");
const bannerRouter = require("./routes/banner");
const productsRouter = require("./routes/products");
const articleRouter = require("./routes/article");
const rateRouter = require("./routes/rateProduct");
const categoryArticleRouter = require("./routes/categoryArticle");
const cartRouter = require("./routes/cart");
const flashDealRouter = require("./routes/flashDeal");
const productLikeRouter = require("./routes/likeProduct");
const bannerCategoryRouter = require("./routes/bannerCategory");

const Products = require("./models/Products");
const CategoryProduct = require("./models/CategoryProduct");
const CategoryArticle = require("./models/CategoryArticle");
const AllBanner = require("./models/AllBanner");
const Article = require("./models/Article");
const Rate = require("./models/Rate");

// Khoi dong app
const app = express();

// Khoi dong Express middleware
app.use(express.json());
app.use(cors());

// Ket noi co so dung lieu
connectDB();

// const dbjson = fs.readFileSync("./rate.json", { encoding: "utf-8" });
// const dbAray = JSON.parse(dbjson);
// console.log(dbAray);
// const postData = async () => {
//   Rate.insertMany(dbAray)
//     .then((value) => console.log(value))
//     .catch((error) => console.log(error));
// };
// postData();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/posts", posts);
app.use("/api/auth", authRouter);
app.use("/api/bill", billRouter);
app.use("/api/account", accountRouter);
app.use("/api/category-product", categoryProductRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/products", productsRouter);
app.use("/api/article", articleRouter);
app.use("/api/rate", rateRouter);
app.use("/api/category-article", categoryArticleRouter);
app.use("/api/cart", cartRouter);
app.use("/api/flash-deal", flashDealRouter);
app.use("/api/product-like", productLikeRouter);
app.use("/api/banner-category", bannerCategoryRouter);
// app.use("/api/products", accountRouter);

const PORT = 5000;

app.listen(PORT, () => console.log(`server start port ${PORT}`));
