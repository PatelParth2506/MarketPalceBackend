const { body } = require('express-validator')

const id =body('id').notEmpty().withMessage("Id Can't Be Empty")

const product_id = body('product_id').notEmpty().withMessage("Product Id Can't Be Empty")

const quentity = body('quentity').notEmpty().withMessage("Quentity Can't Be Empty")

const addToCart = [product_id,quentity]

module.exports = {
    id,
    product_id,
    quentity,
    addToCart
}
