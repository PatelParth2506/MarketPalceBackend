const { apiResponse } = require("../utils/apiResponse");
const { apiError } = require("../utils/apiError");
const db = require("../models/index");
const { where, Op } = require("sequelize");
const { HTTP_STATUS, HTTP_CODE } = require("../utils/constans");
const activityLog = require("../utils/activityLog");
const Discount = db.Discount;
const Product = db.Product;
const ProductLog = db.ProductLog
const DiscountLog = db.DiscountLog

const ctrlAddDiscount = async (req, res) => {
  const checkDiscount = await Discount.findOne({
    where: {
      startingDate: req.body.startingDate,
      discount: req.body.discount,
      product_id: req.body.product_id,
    },
  });
  if (checkDiscount){
    throw new apiError(
      HTTP_STATUS.CONFLICT,
      "Data With Same Creditinals Exists"
    );
  }

  const product = await Product.findByPk(req.body.product_id);
  if (!product){
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "No Product Found With This Id"
    );
  }

  if (req.user.user_id !== product.createdBy && req.user.role === "user"){
    throw new apiError(
      HTTP_STATUS.UNAUTHORIZED,
      "You Don't Have Access To Create Discount"
    );
  }

  if (
    (req.body.typeOfDiscount === "per" && req.body.discount > 100) ||
    (req.body.typeOfDiscount === "flat" && req.body.discount > product.price)
  ){
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "You Cant Give More Discount Then Product Price"
    );
  }

  const overlapDiscount = await Discount.findOne({
    where: {
      product_id: req.body.product_id,
      [Op.or]: [
        {
          startingDate: {
            [Op.lte]: req.body.endingDate,
          },
          endingDate: {
            [Op.gte]: req.body.startingDate,
          },
        },
      ],
    },
  });
  if (overlapDiscount){
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "Discount Already Exists In This Time"
    );
  }

  const discount = await Discount.create({
    startingDate: req.body.startingDate,
    endingDate: req.body.endingDate,
    discount: req.body.discount,
    product_id: req.body.product_id,
    createdBy: req.user.user_id,
    typeOfDiscount: req.body.typeOfDiscount,
  });
  await activityLog(discount,DiscountLog)
  
  const date = new Date();
  if (discount.startingDate <= date && discount.endingDate >= date) {
    product.discountedPrice = product.price - (discount.discount / 100) * product.price;
    discount.is_active = true;
    await discount.save();
    await product.save();
    await activityLog(discount,DiscountLog)
    await activityLog(product,ProductLog)
  }

  res
    .status(HTTP_STATUS.CREATED)
    .json(
      new apiResponse(
        HTTP_CODE.CREATED,
        "Discount Added SuccessFully",
        discount
      )
    );
};

const ctrlDeleteDiscount = async (req, res) => {
  const discount = await Discount.findByPk(req.body.id);
  if (!discount){ 
    throw new apiError(HTTP_STATUS.NOT_FOUND, "No Discount Found");
  }

  if (req.user.user_id !== discount.createdBy || req.user.role === "user"){
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
  }

  if (discount.is_active === true) {
    const product = await Product.findByPk(discount.product_id);
    product.discountedPrice = 0;
    await product.save();
    await activityLog(product,ProductLog)
  }
  await activityLog(discount,DiscountLog)
  await discount.destroy();

  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "Discount Deleted SuccessFully", []));
};

const ctrlGetAllDiscount = async (req, res) => {
  const discounts = await Discount.findAll({
    include: {
      model: Product,
      attributes: [
        "product_title",
        "product_description",
        "price",
        "discountedPrice",
      ],
    },
  });
  if (!discounts){
    throw new apiError(HTTP_STATUS.NOT_FOUND, "No Discounts Found");
  }

  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(
        HTTP_STATUS.OK,
        "All Discount Fetched SuccessFully",
        discounts
      )
    );
};

const ctrlGetDiscountOfProduct = async (req, res) => {
  const discount = await Discount.findAll({
    where: { 
      product_id: req.body.product_id
    },
  });
  if (!discount){
    throw new apiError(
      HTTP_STATUS.NOT_FOUND,
      "No Discount Found with This ProductId"
    );
  }

  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(HTTP_CODE.OK, "All Discount Fetched Of Product", discount)
    );
};

const ctrlUpdateDiscount = async (req, res) => {
  const discount = await Discount.findByPk(req.body.id, {
    include: {
      model: Product,
      attributes: ["price", "discountedPrice"],
    },
  });
  if (!discount){
    throw new apiError(HTTP_STATUS.NOT_FOUND, "No Discount Found");
  }

  const updatedData = {};
  if (req.body.startingDate && req.body.endingDate) {
    if (req.body.startingDate > req.body.endingDate){
      throw new apiError(
        HTTP_STATUS.BAD_REQUEST,
        "Starting Date Can't Be More Then EndingDate"
      );
    }
    updatedData.startingDate = req.body.startingDate;
    updatedData.endingDate = req.body.endingDate;
  } else {
    if (req.body.startingDate) {
      if (req.body.startingDate > discount.endingDate){
        throw new apiError(
          HTTP_STATUS.BAD_REQUEST,
          "Starting Date Can't Be More Then EndingDate"
        );
      }
      updatedData.startingDate = req.body.startingDate;
    }
    if (req.body.endingDate) {
      if (req.body.endingDate > discount.startingDate){
        throw new apiError(
          HTTP_STATUS.BAD_REQUEST,
          "Ending Date Can't Be Less Then StartingDate"
        );
      }
      updatedData.endingDate = req.body.endingDate;
    }
  }
  if (req.body.discount) {
    if (
      (discount.typeOfDiscount === "per" && req.body.discount > 100) ||
      (discount.typeOfDiscount === "flat" &&req.body.discount > discount.Products.price)
    ){
      throw new apiError(
        HTTP_STATUS.BAD_REQUEST,
        "Discount Can't Higher Then Product Price"
      );
    }
    updatedData.discount = req.body.discount;
  }
  if (req.body.product_id){
    updatedData.product_id = req.body.product_id;
  }
  if (Object.keys(updatedData).length === 0){
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "One Of The Feild Is Required To Update"
    );
  }
  
  await discount.update(updatedData);
  await activityLog(discount,DiscountLog)
  
  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(
        HTTP_CODE.OK,
        "Discount Updated SuccessFully",
        discount
      )
    );
};

module.exports = {
  ctrlAddDiscount,
  ctrlDeleteDiscount,
  ctrlGetAllDiscount,
  ctrlUpdateDiscount,
  ctrlGetDiscountOfProduct,
};
