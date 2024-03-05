// Requiring packages
let express = require("express");
let Router = express.Router();

// get Controllers
let adminController = require("../controller/adminController");

// Handle Routes
Router.get("/admin/dashboard", adminController.getDashboard);
Router.get("/admin/addProduct", adminController.getAddProduct);
Router.post("/admin/addProduct", adminController.postAddProduct);
Router.get(
  "/admin/calculateProductPrice",
  adminController.getCalculateProductPrice
);
Router.post(
  "/admin/calculateProductPrice",
  adminController.postCalculateProductPrice
);
Router.post(
  "/admin/calculateMultipleProductPrice",
  adminController.postCalculateMultipleProductPrice
);
Router.get("/admin/dailyReport", adminController.getDailyReport);
Router.post("/admin/dailyReport", adminController.postDailyReport);
Router.get("/admin/showProducts", adminController.getShowProducts);
Router.get(
  "/admin/showProductDetails/:prodId",
  adminController.getShowProductDetails
);
Router.get("/admin/updateProduct/:prodId", adminController.updateProduct);
Router.post("/admin/updateProduct", adminController.postUpdateProduct);
Router.post(
  "/admin/updateCombinedProduct",
  adminController.postUpdateCombinedProduct
);
Router.get("/admin/deleteProduct/:prodId", adminController.deleteProduct);
Router.get("/admin/addAsset", adminController.addAsset);
Router.post("/admin/addAsset", adminController.postAddAsset);
Router.get("/admin/seeAsset", adminController.getAsset);
Router.get("/admin/seeIncome", adminController.getSellingIncome);
Router.get(
  "/admin/singleDateData/:date/:database",
  adminController.fetchSingleData
);
Router.get("/admin/addExpense", adminController.addExpense);
Router.post("/admin/addExpense", adminController.postAddExpense);
Router.get("/admin/seeExpense", adminController.getSeeExpense);
Router.get("/admin/seeFullReport", adminController.getFullReport);
Router.post("/admin/seeFullReport", adminController.postFullReport);
Router.get("/admin/seePreviousReports", adminController.getSeePreviousReports);
Router.post("/admin/updateDailyReport", adminController.updateDailyReport);
// exporting routes
module.exports = Router;
