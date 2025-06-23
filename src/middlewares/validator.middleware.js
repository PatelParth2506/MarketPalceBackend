const { validationResult }  = require('express-validator')
const { apiError } = require('../utils/apiError.js')
const { HTTP_STATUS, HTTP_CODE } = require('../utils/constans.js')

const validator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array().map(err => err.msg));
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      new apiError(HTTP_CODE.VALIDATION,errors.array().map(err => err.msg),errors.array().map((err)=>{ return { "msg": err.msg, "type":err.type } }))
    );
  }

  next();
};

module.exports = {
    validator
}