'use strict';

const { Types } = require('mongoose');
const {
  ProductModel,
  ElectronicModel,
  ClothingModel,
  FurnitureModel,
} = require('../product.model');
const { getSelectData, unGetSelectData } = require('../../utils');
class ProductRepo {
  static async queryProduct({ query, skip, limit }) {
    return await ProductModel.find(query)
      .populate('product_shop', 'name email -_id')
      .sort({ updateAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  static async updateProductById({
    productId,
    bodyUpdate,
    model,
    isNew = true,
  }) {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
      new: isNew,
    });
  }

  static async findAllDraftsForShop({ query, skip, limit }) {
    return await ProductRepo.queryProduct({ query, skip, limit });
  }

  static async findAllPublishForShop({ query, skip, limit }) {
    return await ProductRepo.queryProduct({ query, skip, limit });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    const foundShop = await ProductModel.findOne({
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id),
    });
    if (!foundShop) return null;

    const { modifiedCount } = await ProductModel.updateOne(
      { _id: product_id },
      {
        isDraft: false,
        isPublished: true,
      },
    );
    return { modifiedCount };
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    const foundShop = await ProductModel.findOne({
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id),
    });
    if (!foundShop) return null;

    const { modifiedCount } = await ProductModel.updateOne(
      { _id: product_id },
      {
        isDraft: true,
        isPublished: false,
      },
    );
    return { modifiedCount };
  }

  static async searchProductsByUser({ keySearch }) {
    console.log(keySearch);
    const regexSearch = new RegExp(keySearch);
    const results = await ProductModel.find(
      {
        isPublished: true,
        $text: {
          $search: regexSearch,
        },
      },
      {
        score: {
          $meta: 'textScore',
        },
      },
    )
      .sort({
        score: {
          $meta: 'textScore',
        },
      })
      .lean();

    return results;
  }

  static async findAllProducts({ limit, page, sort, filter, select }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const products = await ProductModel.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();

    return products;
  }

  static async getDetailProduct({ product_id, unSelect=[] }) {
    const product = await ProductModel.findById(product_id)
      .select(unGetSelectData(unSelect))
      .lean();

    return product;
  }
}

module.exports = ProductRepo;
