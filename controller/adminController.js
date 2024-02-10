// requiring package
let formidable = require("formidable");
let fs = require("fs-extra");
let path = require("path");
let rootDir = require("../utility/root");
let mongoose = require("mongoose");

// importing models
let Product = require("../model/product");

exports.getDashboard = (req, res, next) => {
  res.render("admin/dashboard", {
    user: req.session.user,
  });
};
exports.getAddProduct = async (req, res, next) => {
  let products = await Product.find({});
  res.render("admin/addProduct", {
    user: req.session.user,
    products: products,
  });
};
exports.getCalculateProductPrice = async (req, res, next) => {
  let products = await Product.find({});
  res.render("admin/calculateProductPrice", {
    user: req.session.user,
    products: products,
  });
};
exports.postAddProduct = (req, res, next) => {
  let form = new formidable.IncomingForm({
    multiples: true,
    keepExtensions: true,
  });
  try {
    form.parse(req, async (formFetchingError, fields, files) => {
      if (formFetchingError) {
        throw new Error(`Form Fetching Error ${formFetchingError}`);
      } else {
        let productName = fields.productName[0];
        let productBrand = fields.productBrand[0];
        let productKitchenStock = fields.productKitchenStock[0];
        let productCanteenStock = fields.productCanteenStock[0];
        let productQuantityUnit = fields.productQuantityUnit[0];
        let productIsNonSelling = fields.productIsNonSelling[0];
        let productIsCombined = fields.productIsCombined[0];
        let uploadedBy = fields.uploadedBy[0];
        let productCategory = fields.productCategory[0];
        let productImagePath = files.productImage[0].filepath;
        let productImageName = files.productImage[0].originalFilename;
        let uploadDir = path.join(
          rootDir,
          "public",
          "upload",
          "products",
          `${productBrand}`,
          `${productName}`,
          `${productImageName}`
        );
        await fs.ensureDir(path.dirname(uploadDir));
        await fs.rename(productImagePath, uploadDir);
        let productObj = {
          productName: productName,
          productBrand: productBrand,
          productKitchenStock: productKitchenStock,
          productCanteenStock: productCanteenStock,
          productQuantityUnit: productQuantityUnit,
          productIsNonSelling: productIsNonSelling,
          productIsCombined: productIsCombined,
          uploadedBy: uploadedBy,
          productImage: productImageName,
          productCategory: productCategory,
        };
        if (productIsCombined == "true") {
          let ingredients = JSON.parse(fields.ingredients[0]);
          let ingredientsWithMongooseId = ingredients.map(
            (ing) => new mongoose.Types.ObjectId(ing)
          );
          productObj.ingredients = ingredientsWithMongooseId;
        }
        let product = new Product(productObj);
        product
          .save()
          .then((savedProduct) => {
            res.send("Success");
          })
          .catch((productSavingError) => {
            throw new Error(`Product Saving Error: ${productSavingError}`);
          });
      }
    });
  } catch (productAddingError) {
    res.send(`Product Adding Error: ${productAddingError}`);
  }
};
exports.postCalculateProductPrice = (req, res, next) => {
  let prodObj = req.body;
  let updateOps = prodObj.map((obj) => {
    let updateObj = { $set: {} };
    Object.keys(obj).forEach((key) => {
      if (key != "prodId") {
        if (key == "tags") {
          updateObj.$set[key] = obj[key].map(
            (id) => new mongoose.Types.ObjectId(id)
          );
        } else if (key == "uploadedBy") {
          updateObj.$set[key] = new mongoose.Types.ObjectId(obj[key]);
        } else {
          updateObj.$set[key] = obj[key];
        }
      }
    });
    return {
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(obj.prodId) },
        update: updateObj,
      },
    };
  });
  Product.bulkWrite(updateOps)
    .then((result) => {
      res.send(`${result.modifiedCount} Products Updated`);
    })
    .catch((error) => {
      res.send(`Data Update Error: ${error.message}`);
    });
};
