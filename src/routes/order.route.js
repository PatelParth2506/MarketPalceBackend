const { Router } = require('express')
const router = Router()

const { ctrlPlaceOrder, ctrlUpdateProduct_status, ctrlGetAllOrders, ctrlGetSingleOrder, ctrlGetOrderStats } = require('../controllers/order.controller')
const auth = require('../middlewares/auth.midddleware')
const { createorder,id,updateorder } = require('../validators/order.validator')
const { validator } = require('../middlewares/validator.middleware')
 
router.post('/v1/api_placeOrder',[auth,createorder,validator],ctrlPlaceOrder)

router.patch('/v1/api_updateOrderStatus',[auth,updateorder,validator],ctrlUpdateProduct_status)

router.get("/v1/api_getAllOrders",auth,ctrlGetAllOrders)

router.get('/v1/api_getSingleOrder',[auth,id,validator],ctrlGetSingleOrder)

router.get('/v1/api_getOrderStats',auth,ctrlGetOrderStats)

module.exports = router