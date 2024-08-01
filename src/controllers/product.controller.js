'use strict';
const { SuccessResponse } = require('../core/success.response');
const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.xxx');
class ProductController {
  // createProduct = async (req, res, next) => {
  //   new SuccessResponse({
  //     message: 'craete new product successfully!',
  //     metadata: await ProductService.createProduct(req.body.product_type,{
  //       ...req.body,
  //       product_shop: req.user.user,
  //     }),
  //   }).send(res);
  // };
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'craete new product successfully!',
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.user,
      }),
    }).send(res);
  };
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'update  product successfully!',
      metadata: await ProductServiceV2.updateProduct(req.body.product_type,req.params.product_id, {
        ...req.body,
      }),
    }).send(res);
  };
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'publish products successfully!',
      metadata: await ProductServiceV2.publishProductByShop({
        product_shop: req.user.user,
        product_id: req.params.id,
      }),
    }).send(res);
  };
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'unpublish products successfully!',
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_shop: req.user.user,
        product_id: req.params.id,
      }),
    }).send(res);
  };
  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  findAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'get list drafts products successfully!',
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.user,
      }),
    }).send(res);
  };

  findAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'get list publish products successfully!',
      metadata: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.user,
      }),
    }).send(res);
  };

  getListSearchProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'get list search products successfully!',
      metadata: await ProductServiceV2.getListSearchProducts(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'get list products successfully!',
      metadata: await ProductServiceV2.findAllProducts(req.query),
    }).send(res);
  };
  getDetailProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'get detail product successfully!',
      metadata: await ProductServiceV2.getDetailProduct(req.params),
    }).send(res);
  };
}
module.exports = new ProductController();
