const db = require("../models/index.js");
const Category = db.Category;
const Subcategory = db.Subcategory
const fs = require("fs");
const path = require("path");
const { apiError } = require("../utils/apiError.js");
const { apiResponse } = require("../utils/apiResponse.js");
const { where } = require("sequelize");

const ctrlCreateCategory = async (req, res) => {
  if (req.user.role === "user") throw new apiError(410, "Unauthorized Access");
  const categorycheck = await Category.findOne({
    where: { title: req.body.title, is_delete: false },
  });
  if (categorycheck)
    throw new apiError(402, "Category With This Creditinals Already Exists");
  const image_path = req.file.path;
  if (!image_path)
    throw new apiError(404, "Image Path Is Required To Upload Image");

  const category = await Category.create({
    title: req.body.title,
    image_path,
    description: req.body.description,
    createdBy: req.user.id,
  });
  res
    .status(200)
    .json(
      new apiResponse(200, category, "Category Created SuccessFully", true)
    );
};

const ctrlGetCategory = async (req, res) => {
  if (!req.user)
    throw new apiError(410, "Unauthorized Access Login To Continue");
  const categorys = await Category.findAll({
    where: {
      is_delete: false,
      include: {
        model: db.Subcategory,
        include: [db.Product],
      },
    },
  });
  if (!categorys) throw new apiError(404, "No Records Found");
  res.status(200).json(new apiResponse(200, categorys, "All Data Fetched"));
};

const ctrlUpdateCategory = async (req, res) => {
  const category = await Category.findByPk(req.body.id);
  if (!category) throw new apiError(404, "No Records Found");
  if (req.user.id !== category.createdBy && req.user.role === "user")
    throw new apiError(410, "Unauthorized Access");

  const updatedData = {};
  if (req.body.title) updatedData.title = req.body.title;
  if (req.body.description) updatedData.description = req.body.description;
  if (req.file?.path) {
    const oldFilePath = path.join(__dirname, "..", "..", category.image_path);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
    updatedData.image_path = req.file.path;
  }

  if (JSON.stringify(updatedData) === "{}") {
    throw new apiError(402, "One of the fields must be updated");
  }
  const recordcheck = await Category.findOne({where:{[Op.or]:{...updatedData}}})
  if(recordcheck) throw new apiError(410,"Can't Updated Recored With This Creditinals Already Exists")
  updatedData.updatedBy = req.user.id;
  await category.update(updatedData);

  res
    .status(200)
    .json(new apiResponse(200, category, "Data Updated Successfully", true));
};

const ctrlDeleteCategory = async (req, res) => {
  const category = await Category.findByPk(req.body.id);
  if (!category) throw new apiError(404, "No Records Found");
  category.is_delete = true;
  await category.save();
  res
    .status(200)
    .json(new apiResponse(200, [], "Records Deleted SuccessFully", true));
};

const ctrlGetSingleCategory = async (req, res) => {
  const { categoryId, subcategoryId } = req.body
  let newdata = []

  if(categoryId){
      const category = await Category.findByPk(req.body.categoryId, {
    where: { is_delete: false },
    include: {
      model: db.Subcategory,
      include: [db.Product],
    },
  });
  if (!category) throw new apiError(404, "No Category Found");

  const category_title = category.title;
  newdata = category.Subcategories.flatMap((subcat) => {
    const subcategory = subcat.toJSON();
    const subcategory_title = subcategory.subcategory_title;
    const product = subcategory.Products.map((prod) => {
      return {
        category_title: category_title,
        subcategory_title: subcategory_title,
        product_title: prod.product_title,
        product_description: prod.product_description,
        product_image_path: prod.product_image_path,
      };
    });
    return product
  });
  }else if(subcategoryId){
     const subCategory = await Subcategory.findByPk(req.body.subcategoryId, {
        where: { is_delete: false },
        include: [Category,db.Product],
      });
      const subcategory_title = subCategory.subcategory_title
      const category_title = subCategory.Category.title
      newdata = subCategory.Products.map((product)=>{
        return {  
          subcategory_title,
          category_title,
          product_title:product.product_title,
          product_description: product.product_description,
          product_image_path: product.product_image_path,
        }
      })
  }
  res
    .status(200)
    .json(new apiResponse(200, "Category Fetched SuccessFully", newdata));
};

module.exports = {
  ctrlCreateCategory,
  ctrlDeleteCategory,
  ctrlGetCategory,
  ctrlUpdateCategory,
  ctrlGetSingleCategory,
};
