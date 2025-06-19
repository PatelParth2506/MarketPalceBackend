const { Router } = require('express')
const router = Router()

const {  ctrlCreateAddress,
    ctrlDeleteAddress,
    ctrlGetAddressByUserId,
    ctrlUpdateAddress } = require('../controllers/address.controller')
const auth = require('../middlewares/auth.midddleware')
const { createAddress,id, user_id } = require('../validators/address.validator')
const upload = require('../middlewares/multer.middleware')
const { validator } = require('../middlewares/validator.middleware')

router.post('/v1/api_createAddress',[auth,createAddress,validator],ctrlCreateAddress)

router.delete('/v1/api_deleteAddress',[auth,id,validator],ctrlDeleteAddress)

router.patch('/v1/api_updateAddress',[auth,id,upload.none(),validator],ctrlUpdateAddress)

router.get('/v1/api_getAddressByUserid',[auth,user_id,validator],ctrlGetAddressByUserId)

module.exports = router