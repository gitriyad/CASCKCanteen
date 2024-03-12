// importing models
let User = require("../model/user");

exports.getUrl = (req, res, next) => {
  console.log("mi", req.path);
  next();
};
exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
};
exports.pageNotFound = (req, res, next) => {
  res.redirect("/");
};
