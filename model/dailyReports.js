let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let dailyReportSchema = new Schema({
  date: {
    type: Date,
    default: new Date(),
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  productName: {
    type: String,
  },
  previousStock: {
    storeStock: {
      type: Number,
    },
    canteenStock: {
      type: Number,
    },
  },
  buy: {
    perUnitPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
  },
  totalStock: {
    type: Number,
  },
  taken: {
    store: {
      type: Number,
    },
    canteen: {
      type: Number,
    },
  },
  newStock: {
    storeStock: {
      type: Number,
    },
    canteenStock: {
      type: Number,
    },
  },
  sell: {
    perUnitPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
  },
  perUnitProfit: {
    type: Number,
  },
  totalProfit: {
    type: Number,
  },
  remainingStock: {
    type: Number,
  },
  returnStock: {
    store: {
      type: Number,
    },
    canteen: {
      type: Number,
    },
  },
  netStock: {
    storeStock: {
      type: Number,
    },
    canteenStock: {
      type: Number,
    },
  },
  stockValue: {
    type: Number,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

dailyReportSchema.virtual("previousStock.totalStock").get(function () {
  return (
    (this.previousStock.storeStock || 0) +
    (this.previousStock.canteenStock || 0)
  );
});

dailyReportSchema.virtual("buy.totalCost").get(function () {
  return (this.buy.quantity || 0) * (this.buy.perUnitPrice || 0);
});
dailyReportSchema.virtual("newStock.totalStock").get(function () {
  return (this.newStock.storeStock || 0) + (this.newStock.canteenStock || 0);
});
dailyReportSchema.virtual("sell.cost").get(function () {
  return (this.sell.perUnitPrice || 0) * (this.sell.quantity || 0);
});
dailyReportSchema.virtual("netStock.totalNetStock").get(function () {
  return (this.netStock.storeStock || 0) + (this.netStock.canteenStock || 0);
});
dailyReportSchema.set("toObject", { virtuals: true });
dailyReportSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("DailyReport", dailyReportSchema);
