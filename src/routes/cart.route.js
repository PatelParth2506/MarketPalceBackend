const { Router } = require('express')
const router = Router()

const { ctrlAddToCart,
    ctrlGetAllCart,
    ctrlGetCartById,
    ctrlRemoveCart,
    ctrlUpdateQuentity } = require('../controllers/cart.controller')
const auth = require('../middlewares/auth.midddleware')
const { addToCart, id, quentity } = require('../validators/cart.validator')

router.post('/v1/api_adddToCart',[auth,addToCart],ctrlAddToCart)

router.get('/v1/api_getAllCart',auth,ctrlGetAllCart)

router.get('/v1/api_getCartById',auth,ctrlGetCartById)

router.patch('/v1/api_updateQuentity',[auth,id,quentity],ctrlUpdateQuentity)

router.delete('/v1/api_deleteCart',[auth,id],ctrlRemoveCart)

module.exports = router