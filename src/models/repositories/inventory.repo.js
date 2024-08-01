const InventoryModel = require("../inventory.model");
const {Types} =require('mongoose')

class InventoryRepo{

  static async insertInventory({
    productId,shopId,stock,location='unKnown'
  }){
    return await InventoryModel.create({
      invent_productId: productId,
      invent_location: location,
      invent_stock: stock,
      invent_shopId: shopId
    })
  }
}

module.exports= InventoryRepo