const { apiError } = require("../utils/apiError");
const { apiResponse } = require("../utils/apiResponse");
const db = require("../models/index");
const { where } = require("sequelize");
const { raw } = require("mysql2");
const Cart = db.Cart;
const CartLog = db.CartLog
const { HTTP_STATUS, HTTP_CODE } = require("../utils/constans");
const activityLog = require('../utils/activityLog')

const ctrlAddToCart = async (req, res) => {
  const product = await Cart.findOne({
    where: { 
        user_id: req.user.user_id,
         product_id: req.body.product_id
     },
  });

  if (product) {
    product.quentity += req.body.quentity;
    await product.save();
    await activityLog(product,CartLog)
  } else {
    const cart = await Cart.create({
      user_id: req.user.user_id,
      product_id: req.body.product_id,
      quentity: req.body.quentity,
    });
    await activityLog(cart,CartLog)
  }

  res
    .status(HTTP_STATUS.CREATED)
    .json(new apiResponse(HTTP_CODE.CREATED, "Product Added To Cart"));
};

const ctrlRemoveCart = async (req, res) => {
  const cart = await Cart.findByPk(req.body.id);
  if (!cart){
    throw new apiError(
      HTTP_STATUS.NOT_FOUND,
      "No Cart Found With This Details"
    );
    }

  if (cart.user_id !== req.user.user_id || req.user.role === 'user'){
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
  }
  await activityLog(cart,CartLog)
  await cart.destroy();
  
  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "Cart Removed SuccessFully"));
};

const ctrlUpdateQuentity = async (req, res) => {
  const cart = await Cart.findByPk(req.body.id);
  if (!cart){
     throw new apiError(HTTP_STATUS.NOT_FOUND, "No Cart Found");
  }
  
  if (cart.user_id !== req.user.user_id || req.user.role === 'user'){
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
  }

  cart.quentity = req.body.quentity;
  
  await cart.save();
  await activityLog(cart,CartLog)
  
  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "Quentity Updated SuccessFully", cart));
};

const ctrlGetCartById = async (req, res) => {
  const cart = await Cart.findAll({
    where: {
         user_id: req.user.user_id
    },
    include: [ db.Product ],
    raw: true,
  });
  if (!cart){
    throw new apiError(HTTP_STATUS.NOT_FOUND, "No Cart Item Found"); 
  }

  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "Cart Fetched SuccesFully", cart));
};

const ctrlGetAllCart = async (req, res) => {
  const cart = await Cart.findAll({
    include: [ 
        db.Product,
         db.User
    ],
    raw: true,
  });
  if (!cart){
    throw new apiError(HTTP_STATUS.NOT_FOUND, "No Cart Item Found"); 
  }
  
  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "Cart Fetched SuccesFully", cart));
};

module.exports = {
  ctrlAddToCart,
  ctrlGetAllCart,
  ctrlGetCartById,
  ctrlRemoveCart,
  ctrlUpdateQuentity,
};
