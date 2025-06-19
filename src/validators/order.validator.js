const { body } = require('express-validator')

const id = body('id').notEmpty().withMessage("Id Can't Be Empty")

const totalPrice = body('totalPrice').notEmpty().withMessage("totalPrice Can't Be Empty")
                                        .isNumeric().withMessage("It Must Be Number")

const order_status = body('order_status').notEmpty().withMessage("order_status Can't Be Empty")
                                
const createorder = [totalPrice,order_status]

const updateorder = [id,order_status]

module.exports = { 
    id,
    totalPrice,
    order_status,
    createorder,
    updateorder
}