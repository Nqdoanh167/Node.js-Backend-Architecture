'use strict';
const {
  ProductModel,
  ElectronicModel,
  ClothingModel,
  FurnitureModel,
} = require('../models/product.model');
const { BadRequestError, ForbiddenError } = require('../core/error.response');
const ProductRepo = require('../models/repositories/product.repo');

// define Factory class to create product
class ProductFactory {
  static async createProduct(type, payload) {
    const ProductClass = getProductType[type];

    if (!ProductClass)
      throw new BadRequestError(`Invalid product type: ${type}`);
    return new ProductClass(payload).createProduct();
  }
  static async publishProductByShop({product_shop,product_id}){
    return await ProductRepo.publishProductByShop({product_shop,product_id})
  }

  static async unPublishProductByShop({product_shop,product_id}){
    return await ProductRepo.unPublishProductByShop({product_shop,product_id})
  }

  //query
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await ProductRepo.findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await ProductRepo.findAllPublishForShop({ query, limit, skip });
  }

  static async getListSearchProducts({ keySearch} ) {
    return await ProductRepo.searchProductsByUser({ keySearch });
  }
  
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return ProductModel.create({ ...this, _id: product_id });
  }
}

// define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError('Create new clothing error');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }
}

// define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError('Create new electronic error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await FurnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError('Create new Furniture error');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }
}
//register product types
const getProductType = {
  Clothing: Clothing,
  Electronic: Electronic,
  Furniture: Furniture,
};

module.exports = ProductFactory;
