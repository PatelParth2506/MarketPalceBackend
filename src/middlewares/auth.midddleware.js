const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { apiError } = require("../utils/apiError");
const { HTTP_STATUS } = require("../utils/constans");
const db = require("../models/index");

dotenv.config();

const auth = async (req, res, next) => {
  const authHeader = req.headers.auth;

  if (!authHeader && authHeader?.startsWith("Bearer ")) {
    throw new apiError(
      HTTP_STATUS.DATA_NOT_FOUND,
      "No Token Found Unauthorized Access"
    );
  }

  const token = authHeader;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      throw new apiError(
        HTTP_STATUS.DATA_NOT_FOUND,
        "No User Exists With This Details"
      );
    }
    if (user.tokenVersion !== decoded.tokenVersion) {
      throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Invalid Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "Invalid Or Expired Token",
      error
    );
  }
};

module.exports = auth;
