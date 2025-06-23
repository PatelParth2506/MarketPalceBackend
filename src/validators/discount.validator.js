const { body } = require('express-validator')

const id = body('id').notEmpty().withMessage("Id Can't Be Empty")

const startingDate = body('startingDate').notEmpty().withMessage("Starting Date Is Required To Start")
                                        .isISO8601().withMessage("Start Date Must Be Valid Date With ISO Date")

const endingDate = body('endingDate').notEmpty().withMessage("Starting Date Is Required To Start")
                                        .isISO8601().withMessage("Start Date Must Be Valid Date With ISO Date")

const discount = body('discount').notEmpty().withMessage("You Have To Enter Discount")
                                 .isInt().withMessage("It Must Be Number")

const product_id = body('product_id').notEmpty().withMessage("The Product ID Can't Be Empty")
const typeOfDiscount = body('typeOfDiscount').optional()

const createDiscount = [startingDate,endingDate,discount,product_id,typeOfDiscount]

module.exports = {
    id,
    startingDate,
    endingDate,
    discount,
    product_id,
    createDiscount
}