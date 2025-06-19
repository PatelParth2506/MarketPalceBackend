const { body } = require('express-validator')

const id =body('id').notEmpty().withMessage("Id Can't Be Empty")

const apartment = body('apartment').notEmpty().withMessage("It Is Required To Continue")
                                   .isLength({min:6,max:30}).withMessage("It Must Be Between 6-30 Character")

const landmark = body('landmark').notEmpty().withMessage("It Can't Be Empty")

const city = body('city').notEmpty().withMessage("City Must Be Required")

const state = body('state').notEmpty().withMessage("State Is Required TO Enter Address")

const pinCode = body('pinCode').notEmpty().withMessage("It Can't Be Empty")
                                .isLength({max:6,min:6}).withMessage("It Must Be Of 6 Numbers")

const user_id = body('user_id').notEmpty().withMessage("It Can't Be Empty")


const createAddress = [apartment,landmark,city,state,pinCode,user_id]

module.exports = { 
    id,
    apartment,
    landmark,
    city,
    state,
    pinCode,
    user_id,
    createAddress
}