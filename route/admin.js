// Requiring packages
let express = require("express");
let Router = express.Router();

// get Controllers
let adminController = require("../controller/adminController");
let middleware = require("../middleware/middleware");

// Handle Routes
Router.get(
  "/admin/dashboard",
  middleware.isAuthenticated,
  adminController.getDashboard
);
Router.get(
  "/admin/addProduct",
  middleware.isAuthenticated,
  adminController.getAddProduct
);
Router.post(
  "/admin/addProduct",
  middleware.isAuthenticated,
  adminController.postAddProduct
);
Router.get(
  "/admin/calculateProductPrice",
  middleware.isAuthenticated,
  adminController.getCalculateProductPrice
);
Router.post(
  "/admin/calculateProductPrice",
  middleware.isAuthenticated,
  adminController.postCalculateProductPrice
);
Router.post(
  "/admin/calculateMultipleProductPrice",
  middleware.isAuthenticated,
  adminController.postCalculateMultipleProductPrice
);
Router.get(
  "/admin/dailyReport",
  middleware.isAuthenticated,
  adminController.getDailyReport
);
Router.post(
  "/admin/dailyReport",
  middleware.isAuthenticated,
  adminController.postDailyReport
);
Router.get(
  "/admin/showProducts",
  middleware.isAuthenticated,
  adminController.getShowProducts
);
Router.get(
  "/admin/showProductDetails/:prodId",
  middleware.isAuthenticated,
  adminController.getShowProductDetails
);
Router.get(
  "/admin/updateProduct/:prodId",
  middleware.isAuthenticated,
  adminController.updateProduct
);
Router.post("/admin/updateProduct", adminController.postUpdateProduct);
Router.post(
  "/admin/updateCombinedProduct",
  middleware.isAuthenticated,
  adminController.postUpdateCombinedProduct
);
Router.get(
  "/admin/deleteProduct/:prodId",
  middleware.isAuthenticated,
  adminController.deleteProduct
);
Router.get(
  "/admin/addAsset",
  middleware.isAuthenticated,
  adminController.addAsset
);
Router.post(
  "/admin/addAsset",
  middleware.isAuthenticated,
  adminController.postAddAsset
);
Router.get(
  "/admin/seeAsset",
  middleware.isAuthenticated,
  adminController.getAsset
);
Router.get(
  "/admin/seeIncome",
  middleware.isAuthenticated,
  adminController.getSellingIncome
);
Router.get(
  "/admin/singleDateData/:date/:database",
  middleware.isAuthenticated,
  adminController.fetchSingleData
);
Router.get(
  "/admin/addExpense",
  middleware.isAuthenticated,
  adminController.addExpense
);
Router.post(
  "/admin/addExpense",
  middleware.isAuthenticated,
  adminController.postAddExpense
);
Router.get(
  "/admin/seeExpense",
  middleware.isAuthenticated,
  adminController.getSeeExpense
);
Router.get(
  "/admin/seeFullReport",
  middleware.isAuthenticated,
  adminController.getFullReport
);
Router.post(
  "/admin/seeFullReport",
  middleware.isAuthenticated,
  adminController.postFullReport
);
Router.get(
  "/admin/seePreviousReports",
  middleware.isAuthenticated,
  adminController.getSeePreviousReports
);
Router.post(
  "/admin/updateDailyReport",
  middleware.isAuthenticated,
  adminController.updateDailyReport
);
//Router.get("/admin/previewPrint/:pdfFile", adminController.previewPrint);
Router.get(
  "/admin/showSingleProductDetails/:productId/:startDate/:endDate",
  middleware.isAuthenticated,
  adminController.fetchSingleProductDetails
);
Router.post("/deploy", adminController.deploy);
// exporting routes
module.exports = Router;
