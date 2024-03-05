// Requiring Packages
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let sellSchema = new Schema({
  date: {
    type: Date,
    default: new Date(),
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    default: 0,
  },
  perQuantityParchasePrice: {
    type: Number,
    default: 0,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
sellSchema.virtual("totalPrice").get(function () {
  return this.quantity * this.perQuantityParchasePrice;
});

sellSchema.set("toObject", { virtuals: true });
sellSchema.set("toJSON", { virtuals: true });

sellSchema.statics.getTopSell = function (startDate, endDate) {
  return new Promise(async (resolve, reject) => {
    try {
      let sells = await this.find({
        date: { $gte: startDate, $lte: endDate },
      }).populate("product");
      let topSell = sells
        .filter((obj) => obj.product != null)
        .sort((a, b) => b.quantity - a.quantity)
        .filter((obj, i, arr) => arr[0].quantity == obj.quantity)
        .map((obj) => obj.product._id);
      let uniqueTopSell = [...new Set(topSell)];
      resolve(uniqueTopSell);
    } catch (err) {
      reject(err);
    }
  });
};
sellSchema.statics.getTopIncome = function (startDate, endDate) {
  return new Promise(async (resolve, reject) => {
    try {
      let sells = await this.find({
        date: { $gte: startDate, $lte: endDate },
      }).populate("product");
      let topSell = sells
        .filter((obj) => obj.product != null)
        .sort((a, b) => b.totalPrice - a.totalPrice)
        .filter((obj, i, arr) => arr[0].totalPrice == obj.totalPrice)
        .map((obj) => obj.product._id);
      let uniqueTopSell = [...new Set(topSell)];
      resolve(uniqueTopSell);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = mongoose.model("Sell", sellSchema);
