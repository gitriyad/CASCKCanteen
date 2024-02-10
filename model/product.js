// Requiring Packages
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let productSchema = new Schema({
  productName: {
    type: String,
  },
  productBrand: {
    type: String,
  },
  productProfit: {
    type: Number,
    default: 0,
  },
  productBuyPrice: {
    type: Number,
    default: 0,
  },
  productTransportCost: {
    type: Number,
    default: 0,
  },
  productPurchasePrice: {
    type: Number,
    default: 0,
  },
  productSellingPrice: {
    type: Number,
    default: 0,
  },
  productKitchenStock: {
    type: Number,
    default: 0,
  },

  productCanteenStock: {
    type: Number,
    default: 0,
  },

  productStatus: {
    type: String,
    default: "inActive",
  },
  tags: [
    [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  ],
  hasTag: {
    type: Boolean,
    default: false,
  },
  productImage: {
    type: String,
  },
  productQuantityUnit: {
    type: String,
  },
  productIsNonSelling: {
    type: Boolean,
    default: false,
  },
  productIsCombined: {
    type: Boolean,
    default: false,
  },
  ingredients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productCategory: {
    type: String,
  },
  referenceAmount: {
    type: Number,
    default: 0,
  },
});
productSchema.virtual("productKitchenStockValue").get(function () {
  return this.productKitchenStock * this.productSellingPrice;
});
productSchema.virtual("productCanteenStockValue").get(function () {
  return this.productCanteenStock + this.productSellingPrice;
});
productSchema.virtual("productTotalStock").get(function () {
  return this.productKitchenStock + this.productCanteenStock;
});
productSchema.virtual("productTotalStockValue").get(function () {
  return this.productKitchenStockValue + this.productCanteenStockValue;
});

// adding virtual property to productSchema
productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
