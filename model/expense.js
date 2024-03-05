// Requiring Packages
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let expenseSchema = new Schema({
  date: {
    type: Date,
    default: new Date(),
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: null,
  },
  category: {
    type: String,
    default: null,
  },
  expenseCost: {
    type: Number,
    default: 0,
  },
  expenseQuantity: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  perQuantityPurchasePrice: {
    type: Number,
    default: 0,
  },
  totalExpense: {
    type: Number,
    get: function () {
      return this.expenseCost + this.quantity * this.perQuantityPurchasePrice;
    },
    default: function () {
      return this.expenseCost + this.quantity * this.perQuantityPurchasePrice;
    },
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

expenseSchema.set("toObject", { virtuals: true });
expenseSchema.set("toJSON", { virtuals: true });

expenseSchema.statics.getTop = function (startDate, endDate) {
  return new Promise(async (resolve, reject) => {
    try {
      let expenses = await this.find({
        date: { $gte: startDate, $lte: endDate },
      }).populate("product");
      let topExpense = expenses
        .filter((obj) => obj.product != null)
        .sort((a, b) => b.totalExpense - a.totalExpense)
        .filter((obj, i, arr) => arr[0].totalExpense == obj.totalExpense)
        .map((obj) => obj.product._id);
      let uniqueTopExpense = [...new Set(topExpense)];
      resolve(uniqueTopExpense);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = mongoose.model("Expense", expenseSchema);
