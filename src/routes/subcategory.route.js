const { Router } = require('express')
const router = Router()

const { ctrlCreateSubCategory, ctrlDeleteSubCategory, ctrlGetAllSubCategory, ctrlUpdateSubCategory, ctrlGetSubCategoryById }  = require('../controllers/subcategory.controller.js')
const { createSubCategory,id } = require('../validators/subCategory.validator.js')
const upload = require('../middlewares/multer.middleware.js')
const auth  = require('../middlewares/auth.midddleware.js') 
const { validator } = require('../middlewares/validator.middleware.js')

router.post("/v1/api_createSubCategory",[auth,upload.single('image_path'),createSubCategory,validator],ctrlCreateSubCategory)

router.get('/v1/api_getallSubCategory',auth,ctrlGetAllSubCategory)

router.patch('/v1/api_subCategoryUpdate',[auth,upload.single('image_path'),id,validator],ctrlUpdateSubCategory)

router.delete('/v1/api_deleteSubCategory',[auth,id,validator],ctrlDeleteSubCategory)

router.get('/v1/api_getSingleSubCategory',[auth,id,validator],ctrlGetSubCategoryById)

module.exports = router
