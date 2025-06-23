const { body } = require('express-validator')

const id= body('id').notEmpty().withMessage("It Cant be Empty")

const username= body("username").notEmpty().withMessage("Username Is Required")
.isLength({min:3}).withMessage("Message Must be More Then 3 Characters")

const  email =body("email").notEmpty().withMessage("Email Is Required")
.isEmail().withMessage("Invalid Email Format")

const password = body("password").notEmpty().withMessage("Password Is Required")
.isLength({min:6}).withMessage("Password Must Be Atleast 6 Characters")

const role =  body("role").optional()
.isIn(["user","admin"]).withMessage("Type Must Be Either User Or Admin")

const mobileNo = body('mobileNo').notEmpty().withMessage("Password Is Required")
.isLength({min:10,max:10}).withMessage("Password Must Be Atleast 6 Characters")

const refreshToken  = body('refreshToken').notEmpty().withMessage('It Cant Be Empty')

const validateRegister = [username,email,password,role,mobileNo]

const validateLogin = [email,password]

module.exports = {
    id,
    username,
    email,
    password,
    role,
    mobileNo,
    refreshToken,
    validateRegister,
    validateLogin
}
    