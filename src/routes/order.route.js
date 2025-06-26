const { Router } = require('express')
const router = Router()

const { ctrlPlaceOrder, ctrlUpdateProduct_status, ctrlGetAllOrders, ctrlGetSingleOrder, ctrlGetOrderStats, ctrlGetDateWiseOrder } = require('../controllers/order.controller')
const auth = require('../middlewares/auth.midddleware')
const { validator } = require('../middlewares/validator.middleware')

const { createorder,id,updateorder } = require('../validators/order.validator')

router.post('/v1/api_placeOrder',[auth],ctrlPlaceOrder)

router.patch('/v1/api_updateOrderStatus',[auth,updateorder,validator],ctrlUpdateProduct_status)

router.get("/v1/api_getAllOrders",auth,ctrlGetAllOrders)

router.get('/v1/api_getSingleOrder',[auth,id,validator],ctrlGetSingleOrder)

router.get('/v1/api_getOrderStats',auth,ctrlGetOrderStats)

router.get('/v1/api_datewiseOrder',ctrlGetDateWiseOrder)

module.exports = router