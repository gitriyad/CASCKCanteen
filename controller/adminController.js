// requiring package
let formidable = require("formidable");
let fs = require("fs-extra");
let path = require("path");
let rootDir = require("../utility/root");
let mongoose = require("mongoose");
let { exec } = require("child_process");
// const pdf = require("html-pdf");

// importing models
let Product = require("../model/product");
let Sell = require("../model/sell");
let Profit = require("../model/profit");
let Stock = require("../model/stock");
let Expense = require("../model/expense");
let DailyReport = require("../model/dailyReports");
let Asset = require("../model/asset");

exports.getDashboard = (req, res, next) => {
  res.render("admin/dashboard", {
    user: req.session.user,
    currUrl: req.path,
  });
};
exports.getAddProduct = async (req, res, next) => {
  let products = await Product.find({});
  res.render("admin/addProduct", {
    user: req.session.user,
    products: products,
    backUrl: [
      {
        link: "/admin/dashboard",
        text: "Dashboard",
      },
    ],
  });
};
exports.getCalculateProductPrice = async (req, res, next) => {
  let products = await Product.find({}).populate("ingredients.productId");
  res.render("admin/calculateProductPrice", {
    user: req.session.user,
    products: products,
    currUrl: req.path,
    backUrl: [
      {
        link: "/admin/dashboard",
        text: "Dashboard",
      },
    ],
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
        //let productStoreStock = fields.productStoreStock[0];
        //let productCanteenStock = fields.productCanteenStock[0];
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
          //productStoreStock: productStoreStock,
          //productCanteenStock: productCanteenStock,
          productQuantityUnit: productQuantityUnit,
          productIsNonSelling: productIsNonSelling,
          productIsCombined: productIsCombined,
          uploadedBy: uploadedBy,
          productImage: productImageName,
          productCategory: productCategory,
        };
        if (productIsCombined == "true") {
          let ingredients = JSON.parse(fields.ingredients[0]);
          let ingredientsWithMongooseId = ingredients.map((ing) => {
            let id = new mongoose.Types.ObjectId(ing.productId);
            let quantity = Number(ing.quantity);
            let quantityWisePrice = Number(ing.quantityWisePrice);
            return {
              productId: id,
              quantity: quantity,
              quantityWisePrice: quantityWisePrice,
            };
          });
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
    res.status(500).send(`Product Adding Error: ${productAddingError}`);
  }
};
exports.postCalculateProductPrice = async (req, res, next) => {
  let prodObj = req.body;
  let updateOps = [];
  for (let obj of prodObj) {
    let updateObj = { $set: {} };
    for (let key of Object.keys(obj)) {
      if (key !== "prodId") {
        if (key === "tags") {
          updateObj.$set[key] = obj[key].map(
            (id) => new mongoose.Types.ObjectId(String(id))
          );
        } else if (key === "uploadedBy") {
          updateObj.$set[key] = new mongoose.Types.ObjectId(String(obj[key]));
        } else if (key === "referenceAmount") {
          let product = await Product.findById(
            new mongoose.Types.ObjectId(String(obj["prodId"]))
          );
          updateObj.$set["productStoreStock"] =
            product.productStoreStock + Number(obj[key]);
          updateObj.$set[key] = obj[key];
        } else {
          updateObj.$set[key] = obj[key];
        }
      }
    }
    updateOps.push({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(String(obj.prodId)) },
        update: updateObj,
      },
    });
  }
  try {
    const result = await Product.bulkWrite(updateOps);
    res.send(`${result.modifiedCount} Products Updated`);
  } catch (error) {
    res.send(`Data Update Error: ${error.message}`);
  }
};

exports.postCalculateMultipleProductPrice = async (req, res, next) => {
  let multipleProductObj = req.body;
  let updateOperations = [];

  for (let product of multipleProductObj) {
    let upObj = { $set: {} };

    for (let key of Object.keys(product)) {
      if (key != "prodId") {
        if (key == "ingredients") {
          let ingArr = product[key].map((ingObj) => {
            let id = new mongoose.Types.ObjectId(ingObj.productId);
            let totalQuantity = parseFloat(ingObj.totalQuantity);
            let perProductQuantity = parseFloat(ingObj.perProductQuantity);
            let quantityWisePrice = parseFloat(ingObj.quantityWisePrice);
            return {
              productId: id,
              totalQuantity: totalQuantity,
              perProductQuantity: perProductQuantity,
              quantityWisePrice: quantityWisePrice,
            };
          });
          upObj.$set[key] = ingArr;
        } else if (key == "uploadedBy") {
          upObj.$set[key] = new mongoose.Types.ObjectId(product[key]);
        } else if (key === "referenceAmount") {
          let productDoc = await Product.findById(
            new mongoose.Types.ObjectId(product["prodId"])
          );
          upObj.$set["productStoreStock"] =
            productDoc.productStoreStock + Number(product[key]);
          upObj.$set[key] = product[key];
        } else {
          upObj.$set[key] = product[key];
        }
      }
    }
    updateOperations.push({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(product.prodId) },
        update: upObj,
      },
    });
  }

  try {
    const result = await Product.bulkWrite(updateOperations);
    res.send(`${result.modifiedCount} Products Updated`);
  } catch (error) {
    res.send(`Data Update Error: ${error.message}`);
  }
};

exports.getDailyReport = async (req, res, next) => {
  let products = await Product.find({ productIsNonSelling: false }).populate(
    "ingredients.productId"
  );
  res.render("admin/dailyReport", {
    products: products,
    user: req.session.user,
    backUrl: [
      {
        link: "/admin/dashboard",
        text: "Dashboard",
      },
    ],
  });
};
exports.postDailyReport = async (req, res, next) => {
  let dailyReport = req.body.dailyReport;
  let sell = req.body.sell;
  let profit = req.body.profit;
  let stock = req.body.stock;
  let expense = req.body.expense;
  let stockUpdate = req.body.productStockUpdate;
  let stockUpdateArr = stockUpdate.map((stockObj) => {
    stockObj.productId = new mongoose.Types.ObjectId(stockObj.productId);
    return stockObj;
  });
  let stockUpdateOps = stockUpdateArr.map((obj) => {
    let upObj = { $set: {} };
    upObj.$set = obj.updateObj;
    return {
      updateOne: {
        filter: { _id: obj.productId },
        update: upObj,
      },
    };
  });
  let dailyReportArr = dailyReport.map((obj) => {
    obj.date = new Date(obj.date);
    obj.uploadedBy = new mongoose.Types.ObjectId(obj.uploadedBy);
    obj.productId = new mongoose.Types.ObjectId(obj.productId);
    return obj;
  });
  let sellArr = sell.map((obj) => {
    obj.date = new Date(obj.date);
    obj.product = new mongoose.Types.ObjectId(obj.product);
    obj.uploadedBy = new mongoose.Types.ObjectId(obj.uploadedBy);
    return obj;
  });

  let profitArr = profit.map((obj) => {
    obj.date = new Date(obj.date);
    obj.product = new mongoose.Types.ObjectId(obj.product);
    obj.uploadedBy = new mongoose.Types.ObjectId(obj.uploadedBy);
    return obj;
  });
  let stockArr = stock.map((obj) => {
    obj.date = new Date(obj.date);
    obj.product = new mongoose.Types.ObjectId(obj.product);
    obj.uploadedBy = new mongoose.Types.ObjectId(obj.uploadedBy);
    return obj;
  });
  let expenseArr = expense.map((obj) => {
    obj.date = new Date(obj.date);
    obj.product = new mongoose.Types.ObjectId(obj.product);
    obj.uploadedBy = new mongoose.Types.ObjectId(obj.uploadedBy);
    return obj;
  });
  Promise.all([
    Sell.insertMany(sellArr),
    Profit.insertMany(profitArr),
    Stock.insertMany(stockArr),
    Expense.insertMany(expenseArr),
    DailyReport.insertMany(dailyReportArr),
    Product.bulkWrite(stockUpdateOps),
  ])
    .then(
      ([
        sellRes,
        profitRes,
        stockRes,
        expenseRes,
        dailyReportRes,
        stockUpdateRes,
      ]) => {
        if (sellRes.length <= 0) {
          throw new Error("Sell Upload Failed");
        } else if (profitRes.length <= 0) {
          throw new Error("Profit Upload Failed");
        } else if (stockRes.length <= 0) {
          throw new Error("Stock Upload Failed");
        } else if (expenseRes.length <= 0) {
          throw new Error("Expense Upload Failed");
        } else if (dailyReportRes.length <= 0) {
          throw new Error("Daily Report Upload Failed");
        } else if (stockUpdateRes.length <= 0) {
          throw new Error("Product Stock Update Failed");
        } else {
          res.send("success");
        }
      }
    )
    .catch((dailyReportError) => {
      res.send(`Daily Report Error: ${dailyReportError.message}`);
    });
};

exports.getShowProducts = async (req, res, next) => {
  let products = await Product.find({ productStatus: "Active" }).populate(
    "uploadedBy"
  );
  res.render("admin/showProducts", {
    products: products,
    backUrl: [
      {
        link: "/admin/dashboard",
        text: "Dashboard",
      },
    ],
  });
};
exports.getShowProductDetails = async (req, res, next) => {
  let id = new mongoose.Types.ObjectId(req.params.prodId);
  let product = await Product.findOne({ _id: id }).populate(
    "uploadedBy tags ingredients.productId"
  );
  res.render("admin/showProductDetails", {
    product: product,
    edit: false,
    user: req.session.user,
    backUrl: [
      {
        link: "/admin/dashboard",
        text: "Dashboard",
      },
      {
        link: "/admin/showProducts",
        text: "Show Products",
      },
    ],
  });
};
exports.updateProduct = async (req, res, next) => {
  let id = new mongoose.Types.ObjectId(req.params.prodId);
  let product = await Product.findOne({ _id: id }).populate([
    { path: "uploadedBy" },
    { path: "tags" },
    { path: "ingredients.productId" },
  ]);
  let productArr = await Product.find({}).populate(
    "uploadedBy tags ingredients.productId"
  );
  res.render("admin/showProductDetails", {
    product: product,
    edit: true,
    productArr: productArr,
    user: req.session.user,
    backUrl: [
      {
        link: "/admin/dashboard",
        text: "Dashboard",
      },
      {
        link: "/admin/showProducts",
        text: "Show Products",
      },
    ],
  });
};
exports.postUpdateProduct = (req, res, next) => {
  let stockUpdate = req.body.stockUpdate;
  let priceUpdate = req.body.priceUpdate;
  stockUpdate.prodId = new mongoose.Types.ObjectId(stockUpdate.prodId);
  stockUpdate.updateObj.uploadedBy = new mongoose.Types.ObjectId(
    stockUpdate.updateObj.uploadedBy
  );
  priceUpdate.forEach((prod) => {
    prod.prodId = new mongoose.Types.ObjectId(prod.prodId);
    prod.updateObj.tags = prod.updateObj.tags.map(
      (tag) => new mongoose.Types.ObjectId(tag)
    );
  });
  let stockUpdateOps = [stockUpdate].map((stock) => {
    let updateObj = { $set: {} };
    updateObj.$set = stock.updateObj;
    return {
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(stock.prodId) },
        update: updateObj,
      },
    };
  });
  let priceUpdateOps = priceUpdate.map((priceObj) => {
    let updateObj = priceObj.updateObj;
    return {
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(priceObj.prodId) },
        update: updateObj,
      },
    };
  });
  Promise.all([
    Product.bulkWrite(stockUpdateOps),
    Product.bulkWrite(priceUpdateOps),
  ])
    .then(([stockUpdateRes, productUpdateRes]) => {
      if (!stockUpdateRes) {
        throw new Error("Stock update failed");
      } else if (!productUpdateRes) {
        throw new Error("Product update failed");
      } else {
        res.send(`success`);
      }
    })
    .catch((productUpdateError) => {
      res.send(`Product update failed: ${productUpdateError.message}`);
    });
};
exports.postUpdateCombinedProduct = (req, res, next) => {
  let obj = req.body;
  obj.prodId = new mongoose.Types.ObjectId(obj.prodId);
  obj.updateObj.ingredients = obj.updateObj.ingredients.map((arrObj) => {
    arrObj.productId = new mongoose.Types.ObjectId(arrObj.productId);
    return arrObj;
  });
  obj.updateObj.uploadedBy = new mongoose.Types.ObjectId(
    obj.updateObj.uploadedBy
  );
  Product.findOneAndUpdate(
    { _id: obj.prodId },
    { $set: obj.updateObj },
    { new: true }
  )
    .then((combineProductUpdateRes) => {
      if (!combineProductUpdateRes) {
        throw new Error("Product update failed");
      } else {
        res.send("success");
      }
    })
    .catch((combineProductUpdateError) => {
      res.send(`Product update failed: ${combineProductUpdateError.message}`);
    });
};
exports.deleteProduct = (req, res, next) => {
  let id = new mongoose.Types.ObjectId(String(req.params.prodId));
  Product.findOneAndDelete(id)
    .then(async (product) => {
      if (!product) {
        throw new Error("Product not found");
      } else {
        let prodImagePath = path.join(
          rootDir,
          "public",
          "upload",
          "products",
          product.productBrand,
          product.productName
        );
        await fs.remove(prodImagePath);
        res.redirect("/admin/showProducts");
      }
    })
    .catch((productDelError) => {
      res.send("Data not Deleted: " + productDelError.message);
    });
};
exports.addAsset = (req, res, next) => {
  res.render("admin/addAsset", {
    user: req.session.user,
    backUrl: [
      {
        link: "/admin/dashboard",
        text: "Dashboard",
      },
    ],
  });
};
exports.postAddAsset = (req, res, next) => {
  let form = new formidable.IncomingForm({
    multiples: true,
    keepExtensions: true,
  });
  try {
    form.parse(req, async (assetFormFetchError, fields, files) => {
      if (assetFormFetchError) {
        throw new Error(
          `Asset Form Fetch Error: ${assetFormFetchError.message}`
        );
      } else {
        let date = new Date(fields.date[0]);
        let assetName = fields.assetName[0];
        let memoNo = fields.memoNo[0];
        let assetPrice = fields.assetPrice[0];
        let assetTransportCost = fields.assetTransportCost[0];
        let purchasePrice = fields.purchasePrice[0];
        let uploadedBy = fields.uploadedBy[0];
        let assetQuantity = fields.assetQuantity[0];
        let assetImagePath = files.assetImage[0].filepath;
        let assetImageName = files.assetImage[0].originalFilename;
        let uploadDir = path.join(
          rootDir,
          "public",
          "upload",
          "asset",
          `${assetName}`,
          `${assetImageName}`
        );
        await fs.ensureDir(path.dirname(uploadDir));
        await fs.rename(assetImagePath, uploadDir);
        let assetObj = {
          date: date,
          assetName: assetName,
          memoNo: memoNo,
          assetPrice: assetPrice,
          assetTransportCost: assetTransportCost,
          purchasePrice: purchasePrice,
          assetImage: assetImageName,
          uploadedBy: new mongoose.Types.ObjectId(uploadedBy),
          assetQuantity: assetQuantity,
        };
        let expenseObj = {
          date: date,
          category: assetName,
          expenseCost: purchasePrice,
          uploadedBy: new mongoose.Types.ObjectId(uploadedBy),
        };
        let asset = new Asset(assetObj);
        asset
          .save()
          .then((assetSaveRes) => {
            let expense = new Expense(expenseObj);
            expense
              .save()
              .then((expenseSaveRes) => {
                res.send("success");
              })
              .catch((expError) => {
                throw new Error(assetSaveError.message);
              });
          })
          .catch((assetSaveError) => {
            throw new Error(assetSaveError.message);
          });
      }
    });
  } catch (assetUploadError) {
    res.status(500).send(`Asset Upload Error: ${assetUploadError.message}`);
  }
};
exports.getAsset = (req, res, next) => {
  Asset.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$date",
          },
        },
        totalPurchasePrice: {
          $sum: "$purchasePrice",
        },
        totalQuantity: {
          $sum: "$assetQuantity",
        },
      },
    },
    {
      $project: {
        date: "$_id",
        totalPurchasePrice: 1,
        totalQuantity: 1,
        _id: 0,
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ])
    .then((aggregateResult) => {
      res.render("admin/seeAsset", {
        assets: aggregateResult,
        database: "assets",
        backUrl: [
          {
            link: "/admin/dashboard",
            text: "Dashboard",
          },
        ],
      });
    })
    .catch((aggregateResultError) => {
      console.error(aggregateResultError);
    });
};
exports.getSellingIncome = (req, res, next) => {
  Sell.aggregate([
    {
      $group: {
        _id: {
          date: {
            $dateToString: { format: "%d-%m-%Y", date: "$date" },
          },
        },
        totalQuantity: { $sum: "$quantity" },
        totalIncome: {
          $sum: {
            $multiply: ["$quantity", "$perQuantityParchasePrice"],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        totalQuantity: 1,
        totalIncome: 1,
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ])
    .then((sellIncomeArr) => {
      res.render("admin/seeSellIncome", {
        sellIncomeArr: sellIncomeArr,
        database: "sells",
        backUrl: [
          {
            link: "/admin/dashboard",
            text: "Dashboard",
          },
        ],
      });
    })
    .catch((sellIncomeError) => {
      res.status(500).send(sellIncomeError);
    });
};
exports.fetchSingleData = (req, res, next) => {
  let date = new Date(req.params.date);
  let database = req.params.database;
  if (database == "assets") {
    fetchAssets(date, res);
  } else if (database == "sells") {
    fetchSells(date, res);
  } else if (database == "expenses") {
    fetchExpenses(date, res);
  } else if (database == "dailyreports") {
    fetchDailyReports(date, res, req);
  }
};
function fetchSells(date, res) {
  Sell.find({ date: { $eq: date } })
    .populate("product uploadedBy")
    .then((sells) => {
      let sellsObj = {};
      sells.forEach((obj) => {
        let prodName = obj.product.productName;
        if (sellsObj[prodName]) {
          sellsObj[prodName].quantity += obj.quantity;
          sellsObj[prodName].totalPrice += obj.totalPrice;
        } else {
          sellsObj[prodName] = {
            name: obj.product.productName,
            quantity: obj.quantity,
            perQuantityPrice: obj.perQuantityParchasePrice,
            totalPrice: obj.totalPrice,
            userName: obj.uploadedBy.userName,
            shortName: obj.uploadedBy.userShortName,
            image: obj.product.productImage,
            brand: obj.product.productBrand,
          };
        }
      });
      return sellsObj;
    })
    .then((sellObj) => {
      let totalIncome = Object.keys(sellObj)
        .map((key) => {
          return sellObj[key].totalPrice;
        })
        .reduce((sum, v) => sum + v, 0);
      return {
        objArr: Object.values(sellObj),
        totalIncome: totalIncome,
      };
    })
    .then(({ objArr, totalIncome }) => {
      objArr.sort((a, b) => b.totalPrice - a.totalPrice);
      res.render("admin/seeDailyIncomeDetails", {
        sellsArr: objArr,
        totalIncome: totalIncome,
        backUrl: [
          {
            link: "/admin/dashboard",
            text: "Dashboard",
          },
          {
            link: "/admin/seeIncome",
            text: "See Incomes",
          },
        ],
      });
    })
    .catch((sellsError) => {
      console.log("sel", sellsError);
      res.status(500).send(sellsError);
    });
}
function fetchAssets(date, res) {
  Asset.find({ date: { $eq: date } })
    .populate("uploadedBy")
    .then((assets) => {
      let totalCost = assets.reduce(
        (sum, assetObj) => sum + assetObj.purchasePrice,
        0
      );
      console.log("asset", assets);
      res.render("admin/seeAssetDetails", {
        assets: assets,
        totalCost: totalCost,
        backUrl: [
          {
            link: "/admin/dashboard",
            text: "Dashboard",
          },
          {
            link: "/admin/seeAsset",
            text: "See Asset",
          },
        ],
      });
    })
    .catch((assetsError) => {
      console.log("assetsError", assetsError);
      res.status(500).send(assetsError);
    });
}
function fetchExpenses(date, res) {
  Expense.find({ date: { $eq: date } })
    .populate("product uploadedBy")
    .then((expenses) => {
      console.log("ex", expenses);
      let expenseArr = expenses.map((exp) => {
        let obj = {};
        if (exp.product == null) {
          obj.product = false;
          obj.name = exp.category;
          obj.cost = exp.totalExpense;
          obj.uploadedBy = exp.uploadedBy.userShortName;
        } else {
          obj.product = true;
          obj.name = exp.product.productName;
          obj.quantity = exp.quantity;
          obj.unitCost = exp.perQuantityPurchasePrice;
          obj.cost = exp.totalExpense;
          obj.image = exp.product.productImage;
          obj.brand = exp.product.productBrand;
          obj.uploadedBy = exp.uploadedBy.userShortName;
        }
        return obj;
      });
      let totalCost = expenseArr.reduce((sum, obj) => sum + obj.cost, 0);
      res.render("admin/seeExpenseDetails", {
        date: date,
        totalCost: totalCost,
        expenseArr: expenseArr,
        backUrl: [
          {
            link: "/admin/dashboard",
            text: "Dashboard",
          },
          {
            link: "/admin/seeExpense",
            text: "See Expenses",
          },
        ],
      });
    });
}
function fetchDailyReports(date, res, req) {
  DailyReport.find({ date: { $eq: date } })
    .then((dailyReportArr) => {
      let totalSell = 0,
        totalProfit = 0,
        totalExpense = 0;
      dailyReportArr.forEach((product) => {
        totalSell += product.sell.cost;
        totalProfit += product.totalProfit;
        totalExpense += product.buy.totalCost;
      });
      res.render("admin/seeDailyReportDetails", {
        productsArr: dailyReportArr,
        user: req.session.user,
        date: date,
        totalSell: totalSell,
        totalProfit: totalProfit,
        totalExpense: totalExpense,
        backUrl: [
          {
            link: "/admin/dashboard",
            text: "Dashboard",
          },
          {
            link: "/admin/seePreviousReports",
            text: "See Reports",
          },
        ],
      });
    })
    .catch((error) => {
      console.error(error);
      res.redirect("/admin/seePreviousReports");
    });
}
exports.addExpense = async (req, res, next) => {
  let categories = await Expense.distinct("category");

  res.render("admin/addExpense", {
    categories: categories,
    user: req.session.user,
    backUrl: [
      {
        link: "/admin/dashboard",
        text: "Dashboard",
      },
    ],
  });
};
exports.postAddExpense = (req, res, next) => {
  let expense = {
    category: req.body.category,
    expenseCost: req.body.cost,
    uploadedBy: new mongoose.Types.ObjectId(req.body.user),
    date: new Date(req.body.date),
  };
  Expense.create(expense)
    .then((createdExpense) => {
      if (!createdExpense) {
        throw new Error("Can not add Expense");
      } else {
        res.send("Success");
      }
    })
    .catch((error) => {
      res.status(500).send(`Add Expense failed: ${error.message}`);
    });
};
exports.getSeeExpense = (req, res, next) => {
  Expense.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$date",
          },
        },
        totalQuantity: {
          $sum: {
            $sum: ["$quantity", "$expenseQuantity"],
          },
        },
        totalCost: {
          $sum: {
            $sum: [
              "$expenseCost",
              { $multiply: ["$quantity", "$perQuantityPurchasePrice"] },
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalQuantity: 1,
        totalCost: 1,
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ]).then((expenseGroupArr) => {
    res.render("admin/seeExpense", {
      expenses: expenseGroupArr,
      database: "expenses",
      backUrl: [
        {
          link: "/admin/dashboard",
          text: "Dashboard",
        },
      ],
    });
  });
};
exports.postFullReport = async (req, res, next) => {
  let [startDate, endDate] = [req.body.startDate, req.body.endDate].map(
    (date) => {
      let [d, m, y] = date.split("-");
      return new Date(`${y}-${m}-${d}`);
    }
  );

  let { productsReport, totalExpense } = await getProductWiseDailyReport(
    startDate,
    endDate
  );
  if (productsReport.length > 0) {
    let topExpense = getTop(productsReport, "totalProductPurchaseCost");
    let topProfit = getTop(productsReport, "totalProfit");
    let topSell = getTop(productsReport, "totalSellQuantity");
    let topIncome = getTop(productsReport, "totalIncome");
    let topProducts = getTopProducts(topExpense, topProfit, topSell, topIncome);
    productsReport.forEach((proObj) => {
      if (topProducts[proObj._id]) {
        proObj.top = topProducts[proObj._id].top;
      }
    });
    let expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate },
    });
    productsReport.sort((a, b) => a.productName.localeCompare(b.productName));
    //generatePDF(res, startDate, endDate);
    res.send({
      productsArr: productsReport,
      totalExpense: totalExpense,
      expenseArr: expenses,
    });
  } else {
    res.status(500).send("No Data Found");
  }
};

async function generatePDF(res, startDate, endDate) {
  let dateRangeString = getLocalDateString([startDate, endDate]).join("-");
  let pdfFileUploadDir = path.join(
    rootDir,
    "public",
    "upload",
    "pdf",
    `${dateRangeString}.pdf`
  );
  let data = await getDateWiseData(startDate, endDate);
  let html = generateHTML(data);
  console.log(html);
  try {
    pdf.create(html).toFile(pdfFileUploadDir, (err, res) => {
      if (err) return console.log(err);
      console.log(res);
    });
  } catch (genError) {
    res.status(500).send(genError.message);
  }
}
function getLocalDateString(arr) {
  return arr.map((date) => {
    let [m, d, y] = date.toLocaleDateString().split("/");
    return `${d.padStart(2, "0")}-${m.padStart(2, "0")}-${y}`;
  });
}
async function getDateWiseData(startDate, endDate) {
  let dateObj = {};
  let productArr = await DailyReport.find({
    date: { $gte: startDate, $lte: endDate },
  }).populate("productId");
  productArr.forEach((product) => {
    let [m, d, y] = new Date(product.date).toLocaleDateString().split("/");
    let date = `${d.padStart(2, "0")} - ${m.padStart(2, "0")} - ${y}`;
    if (dateObj[date]) {
      dateObj[date].push({
        productName: product.productName,
        buy: {
          quantity: product.buy.quantity,
          unitPrice: product.buy.perUnitPrice,
          total: product.buy.totalCost,
        },
        sell: {
          quantity: product.sell.quantity,
          unitPrice: product.sell.perUnitPrice,
          total: product.sell.cost,
        },
      });
    } else {
      dateObj[date] = [
        {
          productName: product.productName,
          buy: {
            quantity: product.buy.quantity,
            unitPrice: product.buy.perUnitPrice,
            total: product.buy.totalCost,
          },
          sell: {
            quantity: product.sell.quantity,
            unitPrice: product.sell.perUnitPrice,
            total: product.sell.cost,
          },
        },
      ];
    }
  });
  return dateObj;
}
function generateHTML(data) {
  let html = `
  <html>
    <head>
      <style>
         .header{
        	display:flex;
        	justify-content:center;
          text-align:center;
        }
        .dateTd{
        	font-size:.8rem
        }
        .tableContainer{
          display: flex;
          justify-content:center;
          aling-itmes:center;
        }
        table{
          width:90vw;
          margin: 0 auto;
        }
        table td{
          min-width: 5rem !important;
          word-break:break-all;
        text-align:center
        }
        tr:nth-child(-n+2){
        	font-weight:800;
        }
      </style>
    </head>
    <body>
    <div class="productTableDiv">
      <div class="header">
        <h1 class="headline">পণ্যের বিবরণ</h1>
      </div>
      <div class="tableContainer">
        <table class="productTable" border="1" cellspacing="0">
          <tr>
            <td rowspan="2">তারিখ</td>
            <td rowspan="2">পণ্যের নাম</td>
            <td colspan="3" align="center">ক্রয়</td>
            <td colspan="3" align="center">বিক্রয়</td>
          </tr>
          <tr>
            <td >পরিমান</td>
            <td >দর</td>
            <td >মোট</td>
            <td >পরিমান</td>
            <td >দর</td>
            <td >মোট</td>
          </tr>
          
          ${Object.keys(data)
            .map(
              (date) => `
          <tr>
            <td rowspan="${data[date].length}" class="dateTd">${date}</td>
            <td>${data[date][0].productName}</td>
            <td>${data[date][0].buy.quantity}</td>
            <td>${data[date][0].buy.unitPrice}</td>
            <td>${data[date][0].buy.total}</td>
            <td>${data[date][0].sell.quantity}</td>
            <td>${data[date][0].sell.unitPrice}</td>
            <td>${data[date][0].sell.total}</td>
            </tr>
            ${data[date]
              .map(
                (info, i, arr) =>
                  `
                ${
                  i > 0
                    ? `
                    <tr>
                      <td>${info.productName}</td>
                      <td>${info.buy.quantity}</td>
                      <td>${info.buy.unitPrice}</td>
                      <td>${info.buy.total}</td>
                      <td>${info.sell.quantity}</td>
                      <td>${info.sell.unitPrice}</td>
                      <td>${info.sell.total}</td>
                    </tr>
                `
                    : ""
                }
              
              `
              )
              .join("")}
          </tr>
            `
            )
            .join("")}
        </table>
      </div>
    </div>
    </body>
  </html>
  `;
  return html;
}

async function getProductWiseDailyReport(startDate, endDate) {
  return DailyReport.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $addFields: {
        totalStock: {
          $add: ["$product.productStoreStock", "$product.productCanteenStock"],
        },
        stockValue: {
          $sum: [
            {
              $multiply: [
                "$product.productStoreStock",
                "$product.productPurchasePrice",
              ],
            },
            {
              $multiply: [
                "$product.productCanteenStock",
                "$product.productPurchasePrice",
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$productId",
        productName: { $first: "$product.productName" },
        productBrand: { $first: "$product.productBrand" },
        productImage: { $first: "$product.productImage" },
        previousPerUnitPurchaseCost: { $first: "$buy.perUnitPrice" },
        previousPerUnitSellPrice: { $first: "$sell.perUnitPrice" },
        totalSellQuantity: { $sum: "$sell.quantity" },
        totalIncome: {
          $sum: { $multiply: ["$sell.perUnitPrice", "$sell.quantity"] },
        },
        totalProductPurchaseCost: {
          $sum: { $multiply: ["$buy.perUnitPrice", "$buy.quantity"] },
        },
        totalPurchase: { $sum: "$buy.quantity" },
        storeStock: { $first: "$product.productStoreStock" },
        canteenStock: { $first: "$product.productCanteenStock" },
        totalStock: { $first: "$totalStock" },
        stockValue: { $first: "$stockValue" },
        presentPerPurchasePrice: { $first: "$product.productPurchasePrice" },
        presentPerUnitSellPrice: { $first: "$product.productSellingPrice" },
      },
    },

    {
      $project: {
        _id: 1,
        productName: 1,
        productBrand: 1,
        productImage: 1,
        previousPerUnitPurchaseCost: 1,
        totalPurchase: 1,
        totalProductPurchaseCost: 1,
        totalSellQuantity: 1,
        previousPerUnitSellPrice: 1,
        totalIncome: 1,
        storeStock: 1,
        canteenStock: 1,
        totalStock: 1,
        stockValue: 1,
        totalProfit: {
          $subtract: ["$totalIncome", "$totalProductPurchaseCost"],
        },
        presentPerPurchasePrice: 1,
        presentPerUnitSellPrice: 1,
      },
    },
    {
      $sort: {
        productName: 1,
      },
    },
  ])
    .then((productReport) => {
      let totalExpense = productReport.reduce(
        (sum, pro) => sum + pro.totalProductPurchaseCost,
        0
      );
      return {
        productsReport: productReport,
        totalExpense: totalExpense,
      };
    })
    .catch((err) => {
      return [];
    });
}
exports.getFullReport = (req, res, next) => {
  res.render("admin/seeFullReport", {
    backUrl: [
      {
        link: "/admin/dashboard",
        text: "Dashboard",
      },
    ],
  });
};
function getTop(arr, control) {
  return [
    ...new Set(
      arr
        .sort((a, b) => b[control] - a[control])
        .filter((pro, i, parr) => parr[0][control] == pro[control])
        .map((pro) => pro._id)
    ),
  ];
}
function getTopProducts(topExpense, topProfit, topSell, topIncome) {
  let topProducts = {};
  topExpense.forEach((pro) => {
    if (topProducts[pro]) {
      topProducts[pro].top.push("Top Expense");
    } else {
      topProducts[pro] = {
        id: pro,
        top: ["Top Expense"],
      };
    }
  });
  topProfit.forEach((pro) => {
    if (topProducts[pro]) {
      topProducts[pro].top.push("Top Profit");
    } else {
      topProducts[pro] = {
        id: pro,
        top: ["Top Profit"],
      };
    }
  });
  topSell.forEach((pro) => {
    if (topProducts[pro]) {
      topProducts[pro].top.push("Top Sell");
    } else {
      topProducts[pro] = {
        id: pro,
        top: ["Top Sell"],
      };
    }
  });
  topIncome.forEach((pro) => {
    if (topProducts[pro]) {
      topProducts[pro].top.push("Top Income");
    } else {
      topProducts[pro] = {
        id: pro,
        top: ["Top Income"],
      };
    }
  });
  return topProducts;
}
exports.getSeePreviousReports = (req, res, next) => {
  DailyReport.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$date",
          },
        },
        totalSell: {
          $sum: {
            $multiply: ["$sell.perUnitPrice", "$sell.quantity"],
          },
        },
        totalProfit: {
          $sum: "$totalProfit",
        },
        totalExpense: {
          $sum: {
            $multiply: ["$buy.perUnitPrice", "$buy.quantity"],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalSell: 1,
        totalProfit: 1,
        totalExpense: 1,
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ])
    .then((dailyReportGroupArr) => {
      res.render("admin/seePreviousReports", {
        reportArr: dailyReportGroupArr,
        database: "dailyreports",
        backUrl: [
          {
            link: "/admin/dashboard",
            text: "Dashboard",
          },
        ],
      });
    })
    .catch((previousReportError) => {
      res.redirect("/admin/dashboard");
    });
};
exports.updateDailyReport = (req, res, next) => {
  let dailyReportArr = req.body.dailyReport;
  let sellArr = req.body.sell;
  let profitArr = req.body.profit;
  let stockArr = req.body.stock;
  let expenseArr = req.body.expense;
  let productStockUpdateArr = req.body.productStockUpdate;
  dailyReportArr = dailyReportArr.map((obj) => {
    obj.id = new mongoose.Types.ObjectId(obj.id);
    obj.updateObj.date = new Date(obj.updateObj.date);
    obj.updateObj.uploadedBy = new mongoose.Types.ObjectId(
      obj.updateObj.uploadedBy
    );
    obj.updateObj.productId = new mongoose.Types.ObjectId(
      obj.updateObj.productId
    );
    return obj;
  });
  sellArr = sellArr.map((obj) => {
    obj.id = new mongoose.Types.ObjectId(obj.id);
    obj.date = new Date(obj.date);
    obj.updateObj.date = new Date(obj.updateObj.date);
    obj.updateObj.product = new mongoose.Types.ObjectId(obj.updateObj.product);
    obj.updateObj.uploadedBy = new mongoose.Types.ObjectId(
      obj.updateObj.uploadedBy
    );
    return obj;
  });

  profitArr = profitArr.map((obj) => {
    obj.id = new mongoose.Types.ObjectId(obj.id);
    obj.date = new Date(obj.date);
    obj.updateObj.date = new Date(obj.updateObj.date);
    obj.updateObj.product = new mongoose.Types.ObjectId(obj.updateObj.product);
    obj.updateObj.uploadedBy = new mongoose.Types.ObjectId(
      obj.updateObj.uploadedBy
    );
    return obj;
  });

  stockArr = stockArr.map((obj) => {
    obj.id = new mongoose.Types.ObjectId(obj.id);
    obj.date = new Date(obj.date);
    obj.updateObj.date = new Date(obj.updateObj.date);
    obj.updateObj.product = new mongoose.Types.ObjectId(obj.updateObj.product);
    obj.updateObj.uploadedBy = new mongoose.Types.ObjectId(
      obj.updateObj.uploadedBy
    );
    return obj;
  });

  expenseArr = expenseArr.map((obj) => {
    obj.id = new mongoose.Types.ObjectId(obj.id);
    obj.date = new Date(obj.date);
    obj.updateObj.date = new Date(obj.updateObj.date);
    obj.updateObj.product = new mongoose.Types.ObjectId(obj.updateObj.product);
    obj.updateObj.uploadedBy = new mongoose.Types.ObjectId(
      obj.updateObj.uploadedBy
    );
    return obj;
  });

  productStockUpdateArr = productStockUpdateArr.map((obj) => {
    obj.productId = new mongoose.Types.ObjectId(obj.productId);
    return obj;
  });
  let dailyReportUpdateOpsArr = dailyReportArr.map((obj) => {
    let updateObj = { $set: {} };
    updateObj.$set = obj.updateObj;
    return {
      updateOne: {
        filter: { _id: obj.id },
        update: updateObj,
      },
    };
  });
  let sellUpdateOpsArr = sellArr.map((obj) => {
    let updateObj = { $set: {} };
    updateObj.$set = obj.updateObj;
    return {
      updateOne: {
        filter: {
          product: obj.id,
          date: obj.date,
        },
        update: updateObj,
      },
    };
  });

  let profitUpdateOpsArr = profitArr.map((obj) => {
    let updateObj = { $set: {} };
    updateObj.$set = obj.updateObj;
    return {
      updateOne: {
        filter: {
          product: obj.id,
          date: obj.date,
        },
        update: updateObj,
      },
    };
  });

  let expenseUpdateOpsArr = expenseArr.map((obj) => {
    let updateObj = { $set: {} };
    updateObj.$set = obj.updateObj;
    return {
      updateOne: {
        filter: {
          product: obj.id,
          date: obj.date,
        },
        update: updateObj,
      },
    };
  });

  let stockUpdateOpsArr = stockArr.map((obj) => {
    let updateObj = { $set: {} };
    updateObj.$set = obj.updateObj;
    return {
      updateOne: {
        filter: {
          product: obj.id,
          date: obj.date,
        },
        update: updateObj,
      },
    };
  });

  let productStockUpdateOpsArr = productStockUpdateArr.map((obj) => {
    let updateObj = { $set: {} };
    updateObj.$set = obj.updateObj;
    return {
      updateOne: {
        filter: { _id: obj.productId },
        update: updateObj,
      },
    };
  });
  Promise.all([
    DailyReport.bulkWrite(dailyReportUpdateOpsArr),
    Sell.bulkWrite(sellUpdateOpsArr),
    Profit.bulkWrite(profitUpdateOpsArr),
    Expense.bulkWrite(expenseUpdateOpsArr),
    Stock.bulkWrite(stockUpdateOpsArr),
    Product.bulkWrite(productStockUpdateOpsArr),
  ])
    .then(
      ([
        dailyReportUpRes,
        sellUpRes,
        profitUpRes,
        expenseUpRes,
        stockUpRes,
        productStockUpRes,
      ]) => {
        if (
          dailyReportUpRes.length <= 0 ||
          sellUpRes.length <= 0 ||
          profitUpRes.length <= 0 ||
          expenseUpRes.length <= 0 ||
          stockUpRes.length <= 0 ||
          productStockUpRes.length <= 0
        ) {
          throw new Error("Report update failed");
        } else {
          res.send("success");
        }
      }
    )
    .catch((reportUpdateError) => {
      res.status(500).send(reportUpdateError);
    });
};
// exports.previewPrint = (req, res, next) => {
//   res.send(`/upload/pdf/${req.params.pdfFile}.pdf`);
// };
exports.fetchSingleProductDetails = (req, res, next) => {
  let productId = new mongoose.Types.ObjectId(String(req.params.productId));
  let [startDate, endDate] = [req.params.startDate, req.params.endDate].map(
    (date) => {
      let [d, m, y] = date.split("-");
      return new Date(`${y}-${m}-${d}`);
    }
  );
  DailyReport.find({
    date: { $gte: startDate, $lte: endDate },
    productId: productId,
  })
    .populate({
      path: "productId",
      populate: {
        path: "uploadedBy",
        model: "User",
      },
    })
    .then((data) => {
      if (data.length <= 0) {
        throw new Error("No data found");
      } else {
        res.render("admin/singleProductDetails", {
          product: data,
          backUrl: [
            {
              link: "/admin/dashboard",
              text: "Dashboard",
            },
            {
              link: "/admin/seeFullReport",
              text: "Full Report",
            },
          ],
        });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
exports.deploy = (req, res, next) => {
  exec("./deploy.sh", (error, stdout, stderr) => {
    if (error) {
      console.error("Error executing deployment script:", error);
    } else {
      console.log("Deployment successful");
    }
  });
};
