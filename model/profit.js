// Requiring Packages
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let profitSchema = new Schema({
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
  perQuantityProfit: {
    type: Number,
    default: 0,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
profitSchema.virtual("totalProfit").get(function () {
  return this.quantity * this.perQuantityProfit;
});

profitSchema.set("toObject", { virtuals: true });
profitSchema.set("toJSON", { virtuals: true });

profitSchema.statics.getTop = function (startDate, endDate) {
  return new Promise(async (resolve, reject) => {
    try {
      let profits = await this.find({
        date: { $gte: startDate, $lte: endDate },
      }).populate("product");
      let topProfit = profits
        .filter((obj) => obj.product != null)
        .sort((a, b) => b.totalProfit - a.totalProfit)
        .filter((obj, i, arr) => arr[0].totalProfit == obj.totalProfit)
        .map((obj) => obj.product._id);
      let uniqueTopProfit = [...new Set(topProfit)];
      resolve(uniqueTopProfit);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = mongoose.model("Profit", profitSchema);
