const { Router } = require('express')
const router  = Router()

const {  ctrlCreateUser,
    ctrlDeleteUser,
    ctrlGetallUsers,
    ctrlLogin,
    ctrlUpdateUser, 
    ctrlGenrateAccessToken,
    ctrlGetAllLoggedInUser,
    ctrlLogoutSingleUser,
    ctrlLogoutAllUser}  = require('../controllers/user.controller')

const {
    validateRegister,
    validateLogin,
    id,
    refreshToken
}  = require('../validators/user.validator')
const activity = require('../middlewares/activitylog.middleware')
const auth  = require('../middlewares/auth.midddleware')
const { validator } = require('../middlewares/validator.middleware')

router.post('/v1/api_register',[auth,validateRegister,validator,activity],ctrlCreateUser)

router.post('/v1/api_login',[validateLogin,validator,activity],ctrlLogin)

router.get('/v1/api_getdata',[auth,activity],ctrlGetallUsers)

router.patch('/v1/api_updateUser',[auth,id,validator,activity],ctrlUpdateUser)

router.delete('/v1/api_deleteuser',[auth,id,validator,activity],ctrlDeleteUser)

router.post('/v1/api_geenrateAccessToken',[refreshToken,validator,activity],ctrlGenrateAccessToken)

router.get('/v1/api_getAllSignedInUser',[auth,id,validator,activity],ctrlGetAllLoggedInUser)

router.post('/v1/api_logoutSingleUser',[auth,refreshToken,validator,activity],ctrlLogoutSingleUser)

router.post('/v1/api_logoutAllUser',[auth,refreshToken,id,validator,activity],ctrlLogoutAllUser)

module.exports = router