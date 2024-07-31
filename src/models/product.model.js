const mongoose = require('mongoose'); // Erase if already required
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
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);




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


module.exports={
  ProductModel: mongoose.model(DOCUMENT_NAME, productSchema),
  ElectronicModel: mongoose.model('Electronics', electronicSchema),
  ClothingModel: mongoose.model('Clothing', clothingSchema)
}