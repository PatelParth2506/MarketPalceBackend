const db = require('../models/index.js')
const { apiError } = require('../utils/apiError.js')
const { apiResponse } = require('../utils/apiResponse.js');
const path = require('path')
const fs = require('fs');
const { where, Op } = require('sequelize');

const Subcategory = db.Subcategory;
const Category = db.Category;

const ctrlCreateSubCategory = async (req, res) => {
  if(req.user.role === 'user') throw new apiError(410,"Unauthorized Access")
  const subCategoryCheck = await Subcategory.findOne({
    where: { subcategory_title: req.body.title,category_id:req.body.category_id },
  });

  if (subCategoryCheck)
    throw new apiError(410, "SubCategory Alrady Exists With This Creditinals");
  if(!req.file) throw new apiError(404,"Image Path Is Required To Create Subcategory")
  
  const category = await Category.findByPk(req.body.category_id);
  if (!category)
    throw new apiError(
      404,
      "No Category Exists With This Details Enter Valid Id"
    );

  const subcategory = await Subcategory.create({
    subcategory_title: req.body.title,
    category_id: req.body.category_id,
    subcategory_description: req.body.description,
    createdBy: req.user.id,
    subcategory_image_path:req.file.path
  });

  res
    .status(200)
    .json(
      new apiResponse(200, subcategory, "SubCategory Created SuccessFully")
    );
};

const ctrlGetAllSubCategory = async (req, res) => {
    if (!req.user.id)
      throw new apiError(410, "Unauthorized Access Login To Access Api");
    const subcategories = await Subcategory.findAll({
      where: { is_delete: false },
      include: [
        {
          model: Category,
        },
      ],
    });
    if (subcategories.length === 0) {
      return res
        .status(404)
        .json(new apiResponse(404, null, "No Records Found"));
    }

    const newdata = subcategories.map((subcat) => {
      const sub = subcat.toJSON();
      const category = sub.Category;
      delete sub.Category;
      return {
        ...sub,
        Category_title: category.title,
        Category_id: category.id,
        Category_description: category.description,
        Category_Image: category.image_path,
      };
    });
    return res
      .status(200)
      .json(new apiResponse(200, newdata, "All Data Fetched Successfully"));
};

const ctrlDeleteSubCategory = async (req, res) => {
    if(req.user.role === 'user') throw new apiError(406,"You Don't Have Access To This Api")
  const check = await Subcategory.findByPk(req.body.id);
  if (!check) throw new apiError(404, "No Records Are Found ");
  // await check.destroy();
  check.is_delete = true;
  await check.save();
  res
    .status(200)
    .json(new apiResponse(200, [], "SubCategory Deleted Successfully"));
};

const ctrlUpdateSubCategory = async (req, res) => {
  if(req.user.role === 'user') throw new apiError(406,"You Don't Have Access To This Api")
  const subCategory = await Subcategory.findByPk(req.body.id);
  if (!subCategory)
    throw new apiError(404, "No Record Found With This Details");
  const updatedData = {};
  if (req.body.title) updatedData.subcategory_title = req.body.title;
  if (req.body.description) updatedData.subcategory_description = req.body.description;
  if (req.body.category_id) updatedData.category_id = req.body.category_id;
  if (req.file && req.file.path) {
    const oldFilePath = path.join(__dirname, "..", "..", subCategory.subcategory_image_path);
    console.log(oldFilePath);
    if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
    }
    updatedData.subcategory_image_path = req.file.path
  }

  if (JSON.stringify(updatedData) === '{}') {
    throw new apiError(404, "One Of The Flied Is Required To Update");
  }
  const recordcheck = await Subcategory.findOne({where:{
    [Op.or]:{...updatedData}
  }})
  if(recordcheck) throw new apiError(410,"Can't Updated Recored With This Creditinals Already Exists")
  updatedData.createdBy = req.user.id
  const upatedSubCategory = await subCategory.update(updatedData);

  res
    .status(200)
    .json(
      new apiResponse(
        200,
        upatedSubCategory,
        "SubCategory Updated Successfully"
      )
    );
};

const ctrlGetSubCategoryById = async (req, res) => {
    if (!req.user)
      throw new apiError(410, "Unauthorized Access Login To Access Api");
  const subCategory = await Subcategory.findByPk(req.body.id, {
    where: { is_delete: false },
    include: [Category,db.Product],
  });
  const subcategory_title = subCategory.subcategory_title
  const category_title = subCategory.Category.title
  const newdata = subCategory.Products.map((product)=>{
    return {  
      subcategory_title,
      category_title,
      product_title:product.product_title,
      product_description: product.product_description,
      product_image_path: product.product_image_path,
    }
  })

  res
    .status(200)
    .json(new apiResponse(200, newdata, "Data Fetched SuccessFully"));
};

module.exports = { 
    ctrlCreateSubCategory,
    ctrlDeleteSubCategory,
    ctrlGetAllSubCategory,
    ctrlGetSubCategoryById,
    ctrlUpdateSubCategory
}