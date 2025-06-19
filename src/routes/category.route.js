const { Router } = require('express')
const router = Router()

const { ctrlCreateCategory,
    ctrlDeleteCategory,
    ctrlGetCategory,
    ctrlUpdateCategory,
    ctrlGetSingleCategory } = require('../controllers/category.controller')
const { createCategory, id } = require('../validators/category.validator')
const upload = require('../middlewares/multer.middleware')
const auth = require('../middlewares/auth.midddleware')
const { validator } = require('../middlewares/validator.middleware')

router.post("/v1/api_cretaeCategory",[auth,createCategory,upload.single('image_path'),validator],ctrlCreateCategory)

router.get("/v1/api_getalldata",auth,ctrlGetCategory)

router.get("/v1/api_getSingleCategory",[auth,id,validator],ctrlGetSingleCategory)

router.delete("/v1/api_deleteCategory",[auth,id,validator],ctrlDeleteCategory)

router.patch("/v1/api_updateCategory",[auth,id,upload.single('image_path'),validator],ctrlUpdateCategory)

module.exports = router