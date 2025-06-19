const { Router } = require('express')
const router = Router()

const { ctrlCreateProduct,
    ctrlDeleteProduct,
    ctrlGetAllProduct,
    ctrlUpdateProduct } = require('../controllers/product.controller')
const { createProduct, id } = require('../validators/product.validator')
const upload = require('../middlewares/multer.middleware')
const auth = require('../middlewares/auth.midddleware')
const { validator } = require('../middlewares/validator.middleware')

router.post("/v1/api_createProduct",[auth,createProduct,upload.single('image_path'),validator],ctrlCreateProduct)

router.get("/v1/api_getallProduct",auth,ctrlGetAllProduct)

router.delete("/v1/api_deleteProduct",[auth,id,validator],ctrlDeleteProduct)

router.patch("/v1/api_updateProduct",[auth,id,upload.single('image_path'),validator],ctrlUpdateProduct)

module.exports = router