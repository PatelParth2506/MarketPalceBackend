const { Router } = require('express')
const router = Router()

const {  ctrlCreateAddress,
    ctrlDeleteAddress,
    ctrlGetAddressByUserId,
    ctrlUpdateAddress } = require('../controllers/address.controller')
const auth = require('../middlewares/auth.midddleware')
const { createAddress,id, user_id } = require('../validators/address.validator')
const upload = require('../middlewares/multer.middleware')

router.post('/v1/api_createAddress',[auth,createAddress],ctrlCreateAddress)

router.delete('/v1/api_deleteAddress',[auth,id],ctrlDeleteAddress)

router.patch('/v1/api_updateAddress',[auth,id,upload.none()],ctrlUpdateAddress)

router.get('/v1/api_getAddressByUserid',[auth,user_id],ctrlGetAddressByUserId)

module.exports = router