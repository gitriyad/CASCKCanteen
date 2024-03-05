// importing models
let User = require("../model/user");

exports.getUrl = (req, res, next) => {
  console.log("mi", req.path);
  next();
};
