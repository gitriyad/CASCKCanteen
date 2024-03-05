// Requiring Packages
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let stockSchema = new Schema({
  date: {
    type: Date,
    default: function () {
      let curDate = new Date();
      curDate.setHours(0, 0, 0, 0);
      return curDate;
    },
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  prevStoreStock: {
    type: Number,
    default: 0,
  },
  prevCanteenStock: {
    type: Number,
    default: 0,
  },
  netStoreStock: {
    type: Number,
    default: 0,
  },
  netCanteenStock: {
    type: Number,
    default: 0,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
stockSchema.virtual("totalPrevStock").get(function () {
  return this.prevStoreStock + this.prevCanteenStock;
});
stockSchema.virtual("totalNetStock").get(function () {
  return this.netStoreStock + this.netCanteenStock;
});
stockSchema.virtual("totalStock").get(function () {
  return this.totalPrevStock + this.totalNetStock;
});

stockSchema.set("toObject", { virtuals: true });
stockSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Stock", stockSchema);
