const { Router } = require('express')
const router  = Router()

const {  ctrlCreateUser,
    ctrlDeleteUser,
    ctrlGetallUsers,
    ctrlLogin,
    ctrlUpdateUser }  = require('../controllers/user.controller')
const {
    validateRegister,
    validateLogin,
    id
}  = require('../validators/user.validator')
const auth  = require('../middlewares/auth.midddleware')
const { validator } = require('../middlewares/validator.middleware')


router.post('/v1/api_register',[auth,validateRegister,validator],ctrlCreateUser)

router.post('/v1/api_login',[validateLogin,validator],ctrlLogin)

router.get('/v1/api_getdata',[auth],ctrlGetallUsers)

router.patch('/v1/api_updateUser',[auth,validateRegister,validator],ctrlUpdateUser)

router.delete('/v1/api_deleteuser',[auth,id,validator],ctrlDeleteUser)

module.exports = router