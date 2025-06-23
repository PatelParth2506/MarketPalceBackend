const { Router } = require('express')
const router = Router()

const { ctrlAddDiscount,
    ctrlDeleteDiscount,
    ctrlGetAllDiscount,
    ctrlUpdateDiscount,
    ctrlGetDiscountOfProduct } = require('../controllers/discount.controller')
const auth = require('../middlewares/auth.midddleware')
const { validator } = require('../middlewares/validator.middleware')
const { createDiscount, product_id,id } = require('../validators/discount.validator')

router.post('/v1/api_crateDiscount',[auth,createDiscount,validator],ctrlAddDiscount)

router.delete('/v1/api_deleteDiscount',[auth,id,validator],ctrlDeleteDiscount)

router.get('/v1/api_getAllDiscount',auth,ctrlGetAllDiscount)

router.patch('/v1/api_updateProductDiscount',[auth,id,validator],ctrlUpdateDiscount)

router.get('/v1/api_getSingleProductDiscount',[auth,product_id,validator],ctrlGetDiscountOfProduct)

module.exports = router

