const { Router } = require('express')
const router = Router()

const { ctrlCreateProduct,
    ctrlDeleteProduct,
    ctrlGetAllProduct,
    ctrlUpdateProduct } = require('../controllers/product.controller')
const { createProduct, id } = require('../validators/product.validator')
const upload = require('../middlewares/multer.middleware')
const auth = require('../middlewares/auth.midddleware')

router.post("/v1/api_createProduct",[auth,createProduct,upload.single('image_path')],ctrlCreateProduct)

router.get("/v1/api_getallProduct",auth,ctrlGetAllProduct)

router.delete("/v1/api_deleteProduct",[auth,id],ctrlDeleteProduct)

router.patch("/v1/api_updateProduct",[auth,id,upload.single('image_path')],ctrlUpdateProduct)

module.exports = router