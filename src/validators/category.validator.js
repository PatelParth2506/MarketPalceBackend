const { body } =require("express-validator");

const id = body("id").notEmpty().withMessage("Id Can't Be Empty")                            

const title = body("title").notEmpty().withMessage("Title Is Required")
                           .isLength({min:4}).withMessage("Title Must Be More Then 4 Charcter")

const description = body("description").optional()
                                            
const createCategory = [title,description]

module.exports= {
    id,
    title,
    description,
    createCategory
}