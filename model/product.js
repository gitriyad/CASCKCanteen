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
  perProductBuyPrice: {
    type: Number,
    default: 0,
  },
  productTransportCost: {
    type: Number,
    default: 0,
  },
  perProductTransportCost: {
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
  productStoreStock: {
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
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
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
      _id: false,
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      totalQuantity: {
        type: Number,
        default: 0,
      },
      perProductQuantity: {
        type: Number,
        default: 0,
      },
      quantityWisePrice: {
        type: Number,
        default: 0,
      },
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

productSchema.virtual("productStoreStockValue").get(function () {
  return (
    parseFloat(this.productStoreStock.toFixed(15)) *
    parseFloat(this.productPurchasePrice.toFixed(15))
  );
});
productSchema.virtual("productCanteenStockValue").get(function () {
  return this.productCanteenStock * this.productPurchasePrice;
});
productSchema.virtual("productTotalStock").get(function () {
  return parseFloat(
    (this.productStoreStock + this.productCanteenStock).toFixed(15)
  );
});
productSchema.virtual("productTotalStockValue").get(function () {
  return this.productStoreStockValue + this.productCanteenStockValue;
});

// adding virtual property to productSchema
productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

// adding static methods

module.exports = mongoose.model("Product", productSchema);
