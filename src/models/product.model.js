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
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
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
  product: mongoose.model(DOCUMENT_NAME, productSchema),
  electronic: mongoose.model('Electronics', electronicSchema),
  clothing: mongoose.model('Clothing', clothingSchema)

}