const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Products = require("../models/Products");
const CategoryProduct = require("../models/CategoryProduct");

// @router GET api/products
// @desc GET products
// @access Private
const getCategory = (dataCategoryProduct, categoryId) => {
  let isCategory = null;
  let breadcrumbs = [];
  let poitBreak = false;

  const findBread = (data, nameParent) => {
    let arrNameParent = [...nameParent];
    if (data.children && data.children.length > 0) {
      data.children.some((item) => {
        if (item.id === categoryId) {
          isCategory = item;
          arrNameParent = [...nameParent, { name: item.name, id: item.id }];
          breadcrumbs = [...arrNameParent];
          poitBreak = true;
        }
        if (item.id !== categoryId) {
          arrNameParent = [...nameParent, { name: item.name, id: item.id }];
          findBread(item, arrNameParent);
        }
        return poitBreak;
      });
    }
  };

  dataCategoryProduct.some((item) => {
    if (item.id === categoryId) {
      isCategory = item;
      breadcrumbs.push({ name: item.name, id: item.id });
      poitBreak = true;
    }
    if (item.id !== categoryId) {
      findBread(item, [{ name: item.name, id: item.id }]);
    }
    return poitBreak;
  });

  return { isCategory };
};
const removeAccents = (str) => {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];

  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
};

router.get("/", async (req, res) => {
  const params = req.query;
  const {
    maxPrice,
    minPrice = 0,
    sttSort,
    limit = 10,
    keySearch,
    brand,
    categoryId,
    minMaxPrice = true,
    page = 1,
    type,
    idProducts,
  } = params;
  try {
    const products = await Products.find();
    let sortListproduct = [...products];
    if (idProducts) {
      const arrIdProduct = idProducts.split(",");
      let products = [];

      for (const idProduct of arrIdProduct) {
        const isProduct = sortListproduct.find(
          (product) => `${product.id}` === `${idProduct}`
        );
        if (isProduct) {
          products.push(isProduct);
        }
      }

      sortListproduct = products;
    }

    if (categoryId) {
      const dataCategoryProduct = await CategoryProduct.find();
      const { isCategory } = getCategory(dataCategoryProduct, categoryId);
      if (!isCategory) {
        return res.status(404).json({
          success: false,
          message:
            "The page you are looking for has been changed or is not available...",
        });
      }
      sortListproduct = _.filter(sortListproduct, {
        categoryInfo: [{ id: categoryId }],
      });
    }

    const arrBrand = sortListproduct.map((product) => product.brand);
    //loại brand trùng lặp
    const checkBrand = _.uniqBy(arrBrand, function (brand) {
      return brand.brand_index;
    });

    if (maxPrice && minPrice) {
      sortListproduct = sortListproduct.filter(
        (item) =>
          item.price <= parseInt(maxPrice) && item.price >= parseInt(minPrice)
      );
    } else if (maxPrice) {
      sortListproduct = sortListproduct.filter(
        (item) => item.price <= parseInt(maxPrice)
      );
    } else if (minPrice) {
      sortListproduct = sortListproduct.filter(
        (item) => item.price >= parseInt(minPrice)
      );
    }

    if (sttSort === "price-asc") {
      sortListproduct = sortListproduct.sort((a, b) => a.price - b.price);
    }

    if (sttSort === "price-desc") {
      sortListproduct = sortListproduct.sort((a, b) => b.price - a.price);
    }

    if (type === "new") {
      sortListproduct = sortListproduct.filter((product) => {
        return product.productType.isNew === 1;
      });
    }
    if (type === "hot") {
      sortListproduct = sortListproduct.filter((product) => {
        return product.productType.isHot === 1;
      });
    }
    if (type === "bestSale") {
      sortListproduct = sortListproduct.filter((product) => {
        return product.productType.isBestSale === 1;
      });
    }
    if (type === "online-only") {
      sortListproduct = sortListproduct.filter((product) => {
        return product.productType["online-only"] === 1;
      });
    }

    if (keySearch) {
      sortListproduct = sortListproduct.filter((product, index) => {
        const value = removeAccents(keySearch);
        const { productName } = product;
        return (
          removeAccents(productName.toUpperCase()).indexOf(
            value.toUpperCase()
          ) !== -1
        );
      });
    }
    var maxFindPrice = null;
    var minFindPrice = null;
    if (minMaxPrice && sortListproduct.length > 0) {
      maxFindPrice = _.maxBy(sortListproduct, function (product) {
        return product.price;
      }).price;
      minFindPrice = _.minBy(sortListproduct, function (product) {
        return product.price;
      }).price;
    }

    if (brand) {
      sortListproduct = sortListproduct.filter((product, index) => {
        return product.brand.brand_index === brand;
      });
    }

    const totalRows = sortListproduct.length;

    const start = (page - 1) * limit;

    const end = page * limit;

    const newProducts = sortListproduct.slice(start, end);
    res.json({
      success: true,
      total: totalRows,
      products: newProducts,
      brand: arrBrand ? checkBrand : [],
      minMaxPrice: minMaxPrice
        ? { min: minFindPrice, max: maxFindPrice }
        : null,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
