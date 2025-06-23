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

router.post("/v1/api_cretaeCategory",[auth,upload.single('image_path'),createCategory,validator],ctrlCreateCategory)

router.get("/v1/api_getalldata",auth,ctrlGetCategory)

router.get("/v1/api_getSingleCategory",[auth],ctrlGetSingleCategory)

router.delete("/v1/api_deleteCategory",[auth,id,validator],ctrlDeleteCategory)

router.patch("/v1/api_updateCategory",[auth,upload.single('image_path'),id,validator],ctrlUpdateCategory)

module.exports = router