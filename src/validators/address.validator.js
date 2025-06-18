const { body } = require('express-validator')

const id =body('id').isEmpty().withMessage("Id Can't Be Empty")

const apartment = body('apartment').isEmpty().withMessage("It Is Required To Continue")
                                   .isLength({min:6,max:30}).withMessage("It Must Be Between 6-30 Character")

const landmark = body('landmark').isEmpty().withMessage("It Can't Be Empty")

const city = body('city').isEmpty().withMessage("City Must Be Required")

const state = body('state').isEmpty().withMessage("State Is Required TO Enter Address")

const pinCode = body('pinCode').isEmpty().withMessage("It Can't Be Empty")
                                .isLength({max:6,min:6}).withMessage("It Must Be Of 6 Numbers")

const user_id = body('user_id').isEmpty().withMessage("It Can't Be Empty")


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