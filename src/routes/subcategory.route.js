const { Router } = require('express')
const router = Router()

const { ctrlCreateSubCategory, ctrlDeleteSubCategory, ctrlGetAllSubCategory, ctrlUpdateSubCategory, ctrlGetSubCategoryById }  = require('../controllers/subcategory.controller.js')
const { createSubCategory,id } = require('../validators/subCategory.validator.js')
const upload = require('../middlewares/multer.middleware.js')
const auth  = require('../middlewares/auth.midddleware.js') 

router.post("/v1/api_createSubCategory",[auth,createSubCategory,upload.single('image_path')],ctrlCreateSubCategory)

router.get('/v1/api_getallSubCategory',auth,ctrlGetAllSubCategory)

router.patch('/v1/api_subCategoryUpdate',[auth,id,upload.single('image_path')],ctrlUpdateSubCategory)

router.delete('/v1/api_deleteSubCategory',[auth,id],ctrlDeleteSubCategory)

router.get('/v1/api_getSingleSubCategory',[auth,id],ctrlGetSubCategoryById)

module.exports = router
