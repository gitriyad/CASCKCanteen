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
// exporting routes
module.exports = Router;
