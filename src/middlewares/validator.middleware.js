const { validationResult }  = require('express-validator')
const { apiError } = require('../utils/apiError.js')

const validator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(
      new apiError(400,errors.array().map(err => err.msg),errors.array())
    );
  }

  next();
};

module.exports = {
    validator
}