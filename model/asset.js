let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let assetSchema = new Schema({
  date: {
    type: Date,
    default: new Date(),
  },
  assetName: {
    type: String,
  },
  memoNo: {
    type: String,
  },
  assetPrice: {
    type: Number,
  },
  assetQuantity: {
    type: Number,
  },
  assetTransportCost: {
    type: Number,
  },
  purchasePrice: {
    type: Number,
  },
  assetImage: {
    type: String,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Asset", assetSchema);
