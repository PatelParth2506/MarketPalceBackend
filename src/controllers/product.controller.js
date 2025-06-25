const { where, Op } = require("sequelize");
const db = require("../models/index.js");
const Product = db.Product;
const ProductLog = db.ProductLog
const ProductImageLog = db.ProductImageLog
const ProductImage = db.ProductImage;
const Subcategory = db.Subcategory;
const { apiError } = require("../utils/apiError.js");
const { apiResponse } = require("../utils/apiResponse.js");
const { HTTP_CODE, HTTP_STATUS } = require("../utils/constans.js");
const fs = require("fs");
const path = require("path");
const activityLog = require('../utils/activityLog.js')

// const ProductImageLogRecored = async (productImages) => {
//   try {
//     const products = productImages.map((product)=>{
//       return product = product.toJSON()
//     })
//     console.log(products)
//     await ProductImageLog.bulkCreate(products)
//   } catch (err) {
//     console.log("Error Inserting Records In ProductImageLog");
//     throw err;
//   }
// };


const ctrlCreateProduct = async (req, res) => {
  const productCheck = await Product.findOne({
    where: {
       product_title: req.body.title
    },
  });
  if (productCheck){
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "Product With This Creditinsals Already Exists"
    );
  }

  const subcategory = await Subcategory.findOne({
    where: {
       subcategory_id: req.body.subcategory_id 
    },
  });
  if (!subcategory){
    throw new apiError(HTTP_STATUS.DATA_NOT_FOUND, "Invalid Subcategory");
  }

  const product = await Product.create({
    product_title: req.body.title,
    product_description: req.body.description,
    subcategory_id: req.body.subcategory_id,
    price: req.body.price,
    createdBy: req.user.user_id,
  });

  if (!product){
    throw new apiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error Createing Product"
    );
  }
  let productImage;
  if (req.files && req.files.length > 0) {
    productImage = req.files.map( ( file ) => {
      if (
        file.mimetype !== "image/png" &&
        file.mimetype !== "image/jpeg" &&
        file.mimetype !== "image/jpg"
      ){
        throw new apiError(
          HTTP_STATUS.VALIDATION,
          "Only Png,Jpg And Jpeg Are Allowed"
        );
      }
      return {
        product_id: product.product_id,
        image_path: file.path,
        image_type: file.mimetype,
        image_name: file.originalname,
      };
    });
  }
  const productImages = await ProductImage.bulkCreate(productImage);
  await activityLog(product,ProductLog)
  res
    .status(HTTP_STATUS.CREATED)
    .json(
      new apiResponse(HTTP_STATUS.CREATED, "Product Created SuccessFully", [
        product,
        productImages,
      ])
    );
};

const ctrlDeleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.body.id);
  if (!product){
    throw new apiError(
      HTTP_STATUS.DATA_NOT_FOUND,
      "No Product Found With This ID"
    );
  }

  if (req.user.user_id !== product.createdBy && req.user.role === "user"){
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
  }

  product.is_delete = true;
  await product.save();
  await activityLog(product,ProductLog)
  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "Product Deleted SuccesFully"));
};

const ctrlUpdateProduct = async (req, res) => {
  const product = await Product.findByPk(req.body.id);
  if (!product){
    throw new apiError(
      HTTP_STATUS.DATA_NOT_FOUND,
      "No Product Found With This Credentials"
    );
  }

  if (product.createdBy !== req.user.user_id && req.user.role === "user") {
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
  }

  const updatedData = {};
  if (req.body.title){
    updatedData.product_title = req.body.title;
  }
  if (req.body.description){
    updatedData.product_description = req.body.description;
  }
  if (req.body.subcategory_id){
    updatedData.subcategory_id = req.body.subcategory_id;
  }
  if (req.body.price){ 
    updatedData.price = req.body.price;
  }
  if (
    Object.keys(updatedData).length === 0 &&
    (!req.files || req.files.length === 0)
  ) {
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "At least one field or image is required to update"
    );
  }

  if (updatedData.product_title) {
    const recordCheck = await Product.findOne({
      where: {
        product_title: updatedData.product_title,
        product_id: {
           [Op.ne]: product.product_id 
        },
      },
    });
    if (recordCheck) {
      throw new apiError(
        HTTP_STATUS.BAD_REQUEST,
        "Can't update record: product with this title already exists"
      );
    }
  }

  if (req.files && req.files.length > 0) {
    const currentImages = await ProductImage.findAll({
      where: { 
        product_id: product.product_id
      },
    });
    const currentImageCount = currentImages.length;
    if (currentImageCount >= 5) {
      throw new apiError(
        HTTP_STATUS.BAD_REQUEST,
        "You can only upload 5 images for a product"
      );
    }

    const remainingSlots = 5 - currentImageCount;
    if (req.files.length > remainingSlots) {
      throw new apiError(
        HTTP_STATUS.BAD_REQUEST,
        `You can only upload ${remainingSlots} more images for this product`
      );
    }

    const productImages = req.files.map((file) => {
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype)) {
        throw new apiError(
          HTTP_STATUS.BAD_REQUEST,
          "Only PNG, JPG, and JPEG images are allowed"
        );
      }
      return {
        product_id: product.product_id,
        image_path: file.path,
        image_type: file.mimetype,
        image_name: file.originalname,
      };
    });
    const products = await ProductImage.bulkCreate(productImages);
  }

  if (Object.keys(updatedData).length > 0 || req.files.length > 0) {
    updatedData.updatedBy = req.user.id;
    await product.update(updatedData);
    await activityLog(product,ProductLog)
  }

  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(HTTP_CODE.OK, product, "Product Updated Successfully")
    );
};

const ctrlGetAllProduct = async (req, res) => {
  const currentDate = new Date();
  const products = await Product.findAll({
    where: {
      is_delete: false 
    },
    include: [
      {
        model: Subcategory,
        include: [db.Category],
      },
      {
        model: ProductImage,
      },
      {
        model: db.Discount,
        attributes: [
          "discount",
          "startingDate",
          "endingDate",
          "typeOfDiscount",
        ],
        where: {
          startingDate: { 
            [Op.lte]: currentDate 
          },
          endingDate: { 
            [Op.gte]: currentDate 
          },
        },
        required: false,
      },
    ],
  });
  if (!products){
    throw new apiError(HTTP_STATUS.DATA_NOT_FOUND, "No Products Found");
  }

  const newdata = products.map((subproduct) => {
    const product = subproduct.toJSON();
    const Discount = product.Discounts[0];
    const Subcategory = product.Subcategory;
    const category = Subcategory.Category;
    const productImages = product.ProductImages.map((image) => {
      return {
        image_path: image.image_path,
        image_type: image.image_type,
        image_name: image.image_name,
      };
    });
    delete product.ProductImages;
    delete product.Subcategory;
    delete product.Discounts;
    return {
      ...product,
      productImages,
      Discount,
      SubCategory_title: Subcategory.subcategory_title,
      SubCategory_description: Subcategory.subcategory_description,
      SubCategory_Image: Subcategory.subcategory_image_path,
      Category_title: category.title,
      Category_id: category.category_id,
      Category_description: category.description,
      Category_Image: category.image_path,
    };
  });
  
  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(HTTP_CODE.OK, "All Product Fetched SuccessFully", newdata)
    );
};

const ctrlGetSingleProduct = async (req, res) => {
  const currentDate = new Date();
  
  const product = await Product.findByPk(req.body.id, {
    include: [
      {
        model: Subcategory,
        include: [ db.Category ],
      },
      {
        model: ProductImage,
      },
      {
        model: db.Discount,
        attributes: [
          "discount",
          "startingDate",
          "endingDate",
          "typeOfDiscount",
          "is_active",
        ],
        where: {
          startingDate: { 
            [Op.lte]: currentDate 
          },
          endingDate: { 
            [Op.gte]: currentDate 
          },
        },
        required: false,
      },
    ],
  });
  if (!product){
    throw new apiError(
      HTTP_STATUS.DATA_NOT_FOUND,
      "No Product Found With This Id"
    );
  }
  const productJson = product.toJSON();
  const prodctImages = productJson.ProductImages.map((image) => {
    return {
      image_path: image.image_path,
      image_type: image.image_type,
      image_name: image.image_name,
    };
  });
  const Discount = productJson.Discounts[0];
  if (Discount.is_active === false) {
    Discount.is_active === true;
    await Discount.save();
  }

  const subcategory = productJson.Subcategory;
  const category = subcategory.Category;
  const newdata = {
    ...productJson,
    Discount,
    productImages: prodctImages,
    SubCategory_title: subcategory.subcategory_title,
    SubCategory_description: subcategory.subcategory_description,
    SubCategory_Image: subcategory.subcategory_image_path,
    Category_title: category.title,
    Category_id: category.category_id,
    Category_description: category.description,
    Category_Image: category.image_path,
  };

  delete newdata.ProductImages;
  delete newdata.Subcategory;
  delete newdata.Discounts;
  
  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(HTTP_CODE.OK, "Product Fetched SuccessFully", newdata)
    );
};

const ctrlDeleteSingleProductImage = async (req, res) => {
  const productImage = await ProductImage.findByPk(req.body.id);
  if (!productImage){
    throw new apiError(
      HTTP_STATUS.DATA_NOT_FOUND,
      "No Product Image Found With This ID"
    );
  }
  // await ProductImageLogRecored(productImage)
  await productImage.destroy();
  
  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "Product Image Deleted SuccessFully"));
};

const ctrlUpdateProductImage = async (req, res) => {
  const productImage = await ProductImage.findByPk(req.body.id);
  if (!productImage){
    throw new apiError(
      HTTP_STATUS.DATA_NOT_FOUND,
      "No Product Image Found With This ID"
    );
  }
  const oldimagepath = path.join(
    __dirname,
    "..",
    "..",
    productImage.image_path
  );

  if (fs.existsSync(oldimagepath)) {
    fs.unlinkSync(oldimagepath);
  }
  
  if (req.files && req.files.length > 0) {
    if (
      req.files[0].mimetype !== "image/png" &&
      req.files[0].mimetype !== "image/jpeg" &&
      req.files[0].mimetype !== "image/jpg"
    ){
      throw new apiError(
        HTTP_STATUS.BAD_REQUEST,
        "Only Png,Jpg And Jpeg Are Allowed"
      );
    }
    productImage.image_path = req.files[0].path;
    productImage.image_type = req.files[0].mimetype;
    productImage.image_name = req.files[0].originalname;
  }
  
  await productImage.save();
  // await ProductImageLogRecored(productImage)
  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(
        HTTP_CODE.OK,
        "Product Image Updated SuccessFully",
        productImage
      )
    );
};

module.exports = {
  ctrlCreateProduct,
  ctrlDeleteProduct,
  ctrlGetAllProduct,
  ctrlUpdateProduct,
  ctrlGetSingleProduct,
  ctrlDeleteSingleProductImage,
  ctrlUpdateProductImage,
};
