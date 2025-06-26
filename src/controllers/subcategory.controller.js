const { apiError } = require("../utils/apiError.js");
const { apiResponse } = require("../utils/apiResponse.js");
const path = require("path");
const fs = require("fs");
const { where, Op } = require("sequelize");
const { HTTP_CODE, HTTP_STATUS } = require("../utils/constans.js");
const db = require("../models/index.js");
const Subcategory = db.Subcategory;
const SubcategoryLog = db.SubCategoryLog
const Category = db.Category;
const activityLog = require('../utils/activityLog.js')

const ctrlCreateSubCategory = async (req, res) => {
  if (req.user.role === "user"){
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
  }
  
  const subCategoryCheck = await Subcategory.findOne({
    where: {
      subcategory_title: req.body.title,
      category_id: req.body.category_id,
    },
  });
  if (subCategoryCheck){
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "SubCategory Alrady Exists With This Creditinals"
    );
  }
  
  if (!req.file){
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "Image Path Is Required To Create Subcategory"
    );
  }

  const category = await Category.findByPk(req.body.category_id);
  if (!category){
    throw new apiError(
      HTTP_STATUS.NOT_FOUND,
      "No Category Exists With This Details Enter Valid Id"
    );
  }

  const subcategory = await Subcategory.create({
    subcategory_title: req.body.title,
    category_id: req.body.category_id,
    subcategory_description: req.body.description,
    createdBy: req.user.user_id,
    subcategory_image_path: req.file.path,
  });
  await activityLog(subcategory,SubcategoryLog)
  res
    .status(HTTP_STATUS.CREATED)
    .json(
      new apiResponse(
        HTTP_CODE.CREATED,
        subcategory,
        "SubCategory Created SuccessFully"
      )
    );
};

const ctrlGetAllSubCategory = async (req, res) => {
  const subcategories = await Subcategory.findAll({
    where: { 
      is_delete: false 
    },
    include: [Category],
  });
  if (subcategories.length === 0) {
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .json(
        new apiResponse(HTTP_CODE.DATA_NOT_FOUND, null, "No Records Found")
      );
  }

  const newdata = subcategories.map((subcat) => {
    const sub = subcat.toJSON();
    const category = sub.Category;
    delete sub.Category;
    return {
      ...sub,
      Category_title: category.title,
      Category_id: category.category_id,
      Category_description: category.description,
      Category_Image: category.image_path,
    };
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(HTTP_CODE.OK, newdata, "All Data Fetched Successfully")
    );
};

const ctrlDeleteSubCategory = async (req, res) => {
  if (req.user.role === "user"){
    throw new apiError(
      HTTP_STATUS.UNAUTHORIZED,
      "You Don't Have Access To This Api"
    );
  }

  const check = await Subcategory.findByPk(req.body.subcategory_id);
  if (!check){
    throw new apiError(HTTP_STATUS.NOT_FOUND, "No Records Are Found ");
  }
  
  check.is_delete = true;
  check.updatedBy = req.user.user_id
  
  await check.save();
  await activityLog(check,SubcategoryLog)
  
  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(HTTP_CODE.OK, [], "SubCategory Deleted Successfully")
    );
};

const ctrlUpdateSubCategory = async (req, res) => {
  if (req.user.role === "user"){
    throw new apiError(
      HTTP_STATUS.UNAUTHORIZED,
      "You Don't Have Access To This Api"
    );
  }

  const subCategory = await Subcategory.findByPk(req.body.subcategory_id);
  if (!subCategory){
    throw new apiError(
      HTTP_STATUS.DATA_NOT_FOUND,
      "No Record Found With This Details"
    );
  }
  
  const updatedData = {};
  if (req.body.title){ 
    updatedData.subcategory_title = req.body.title;
  }
  if (req.body.description){
    updatedData.subcategory_description = req.body.description;
  }
  if (req.body.category_id){ 
    updatedData.category_id = req.body.category_id;
  }
  if (req.file && req.file.path) {
    const oldFilePath = path.join(
      __dirname,
      "..",
      "..",
      subCategory.subcategory_image_path
    );
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
    updatedData.subcategory_image_path = req.file.path;
  }
  if (JSON.stringify(updatedData) === "{}") {
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "One Of The Flied Is Required To Update"
    );
  }

  const recordcheck = await Subcategory.findOne({
    where: {
      [Op.or]: {
        ...updatedData 
      },
    },
  });
  if (recordcheck){
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "Can't Updated Recored With This Creditinals Already Exists"
    );
  }
  
  updatedData.updatedBy = req.user.user_id;
  
  const upatedSubCategory = await subCategory.update(updatedData);
  await activityLog(subCategory,SubcategoryLog)
  
  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(
        HTTP_CODE.OK,
        upatedSubCategory,
        "SubCategory Updated Successfully"
      )
    );
};

const ctrlGetSubCategoryById = async (req, res) => {
  const subCategory = await Subcategory.findByPk(req.body.subcategory_id, {
    where: { 
      is_delete: false 
    },
    include: [
      Category,
       db.Product
    ],
    required : false
  });
  if (!subCategory){
    throw new apiError(
      HTTP_STATUS.NOT_FOUND,
      "No Records Found With This Details"
    );
  }
  
  const subcategory_title = subCategory.subcategory_title;
  const category_title = subCategory.Category.title;
  const newdata = subCategory.Products.map((product) => {
    return {
      subcategory_title,
      category_title,
      product_title: product.product_title,
      product_description: product.product_description,
      product_image_path: product.product_image_path,
    };
  });

  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, newdata, "Data Fetched SuccessFully"));
};

module.exports = {
  ctrlCreateSubCategory,
  ctrlDeleteSubCategory,
  ctrlGetAllSubCategory,
  ctrlGetSubCategoryById,
  ctrlUpdateSubCategory,
};
