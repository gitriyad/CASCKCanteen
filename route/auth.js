// Requiring packages
let express = require("express");
let Router = express.Router();

// get Controllers
let authController = require("../controller/authController");

// Handle Routes
Router.get("/", authController.getLogin);
Router.get("/register", authController.getRegister);
Router.post("/register/:shortName", authController.postRegister);
Router.post("/login", authController.postLogin);

// exporting routes
module.exports = Router;
