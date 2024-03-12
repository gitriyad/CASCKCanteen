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

module.exports = mongoose.model("Expense", expenseSchema);
