const { max } = require('lodash');
const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify');
const Schema = mongoose.Schema; // Erase if already required
const DOCUMENT_NAME = 'Product'; // Model name
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
var productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_slug: {
      type: String,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronic', 'Clothing', 'Furniture'],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating must can not be more than 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);
//create index for search
productSchema.index({product_name:'text', product_description:'text'})
//document middleware before save create
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// defined the product type = clothing

const clothingSchema = new Schema(
  {
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    brand: { type: String, require: true },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: 'Clothes',
  },
);

// defined the product type = electronics

const electronicSchema = new Schema(
  {
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
  },
  {
    timestamps: true,
    collection: 'Electronics',
  },
);

const furnitureSchema = new Schema(
  {
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    brand: { type: String, require: true },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: 'Furnitures',
  },
);

module.exports = {
  ProductModel: mongoose.model(DOCUMENT_NAME, productSchema),
  ElectronicModel: mongoose.model('Electronics', electronicSchema),
  ClothingModel: mongoose.model('Clothing', clothingSchema),
  FurnitureModel: mongoose.model('Furniture', furnitureSchema),
};
