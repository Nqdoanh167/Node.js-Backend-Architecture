const express=require('express')
const productController = require('../../controllers/product.controller')
const  asyncHandler  = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router=express.Router()

router.get('/search/:keySearch',asyncHandler(productController.getListSearchProducts))


//authentication
router.use(authentication);
//
router.post('/',asyncHandler(productController.createProduct))
router.post('/publish/:id',asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id',asyncHandler(productController.unPublishProductByShop))

//query
router.get('/drafts/all',asyncHandler(productController.findAllDraftsForShop))
router.get('/published/all',asyncHandler(productController.findAllPublishForShop))

module.exports=router