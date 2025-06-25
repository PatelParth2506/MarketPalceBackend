const { validationResult } = require("express-validator");
const { apiError } = require("../utils/apiError.js");
const { HTTP_STATUS, HTTP_CODE } = require("../utils/constans.js");
const validator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.param,
      msg: err.msg,
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      new apiError(
        HTTP_STATUS.BAD_REQUEST,
        "Validation Failed",
        formatted
      )
    );
  }

  next();
};


module.exports = {
  validator,
};
