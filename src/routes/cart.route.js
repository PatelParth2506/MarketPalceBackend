const { Router } = require('express')
const router = Router()

const { ctrlAddToCart,
    ctrlGetAllCart,
    ctrlGetCartById,
    ctrlRemoveCart,
    ctrlUpdateQuentity } = require('../controllers/cart.controller')
const auth = require('../middlewares/auth.midddleware')
const { addToCart, id, quentity } = require('../validators/cart.validator')
const { validator } = require('../middlewares/validator.middleware')

router.post('/v1/api_adddToCart',[auth,addToCart,validator],ctrlAddToCart)

router.get('/v1/api_getAllCart',auth,ctrlGetAllCart)

router.get('/v1/api_getCartById',auth,ctrlGetCartById)

router.patch('/v1/api_updateQuentity',[auth,id,quentity,validator],ctrlUpdateQuentity)

router.delete('/v1/api_deleteCart',[auth,id,validator],ctrlRemoveCart)

module.exports = router