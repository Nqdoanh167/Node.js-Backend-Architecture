'use strict';

const { Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Inventory'; // Model name
const COLLECTION_NAME = 'Inventories';
// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    invent_productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    invent_location: {
      type: String,
      default: ' unKnown',
    },
    invent_stock: {
      type: Number,
      require: true,
    },
    invent_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    invent_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

//Export the model
const InventoryModel= model(DOCUMENT_NAME, inventorySchema)
module.exports = InventoryModel
