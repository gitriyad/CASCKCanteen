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

module.exports = mongoose.model("Profit", profitSchema);
