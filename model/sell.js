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

module.exports = mongoose.model("Sell", sellSchema);
