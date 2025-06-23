const { Router } = require('express')
const router = Router()

const { ctrlCreateProduct,
    ctrlDeleteProduct,
    ctrlGetAllProduct,
    ctrlUpdateProduct,
    ctrlGetSingleProduct,
    ctrlDeleteSingleProductImage,
    ctrlUpdateProductImage } = require('../controllers/product.controller')
    
const { createProduct, id } = require('../validators/product.validator')

const upload = require('../middlewares/multer.middleware')
const auth = require('../middlewares/auth.midddleware')
const { validator } = require('../middlewares/validator.middleware')

router.post("/v1/api_createProduct",[auth,upload.array('image_path',5),createProduct,validator],ctrlCreateProduct)

router.get("/v1/api_getallProduct",auth,ctrlGetAllProduct)

router.delete("/v1/api_deleteProduct",[auth,id,validator],ctrlDeleteProduct)

router.patch("/v1/api_updateProduct",[auth,upload.array('image_path',5),id,validator],ctrlUpdateProduct)

router.get("/v1/api_getSingleProduct",[auth,id,validator],ctrlGetSingleProduct)

router.delete('/v1/api_deleteSingleProductImage',[auth,id,validator],ctrlDeleteSingleProductImage)

router.patch('/v1/api_updateProductImage',[auth,upload.array('image_path',1),id,validator],ctrlUpdateProductImage)

module.exports = router