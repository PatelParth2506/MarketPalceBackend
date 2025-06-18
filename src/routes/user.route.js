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


router.post('/v1/api_register',[auth,validateRegister],ctrlCreateUser)

router.post('/v1/api_login',[validateLogin],ctrlLogin)

router.get('/v1/api_getdata',[auth],ctrlGetallUsers)

router.patch('/v1/api_updateUser',[auth,validateRegister],ctrlUpdateUser)

router.delete('/v1/api_deleteuser',[auth,id],ctrlDeleteUser)

module.exports = router