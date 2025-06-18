const { body } = require('express-validator')

const id = body("id").isEmpty().withMessage("Id Can't Be Empty")                            

const title = body("title").isEmpty().withMessage("Title Is Required")
                           .isLength({min:4}).withMessage("Title Must Be More Then 4 Charcter")

const category_id = body("category_id").isEmpty().withMessage("Category ID Must Required")
                                              .isNumeric().withMessage("Id Must Be Integer")

const description = body("description").optional()
                                            
const createSubCategory = [title,description,category_id]

module.exports = {
    id,
    title,
    category_id,
    description,
    createSubCategory
}