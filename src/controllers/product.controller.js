const { where,Op } = require('sequelize');
const db = require('../models/index.js')
const Product = db.Product
const Subcategory = db.Subcategory
const { apiError } = require('../utils/apiError.js')
const { apiResponse } = require('../utils/apiResponse.js');
const { raw } = require('mysql2');

const ctrlCreateProduct = async(req,res)=>{

    const productCheck = await Product.findOne({where:{product_title:req.body.title}})
    if(productCheck) throw new apiError(402,"Product With This Creditinsals Already Exists")
        
    const subcategory = await Subcategory.findOne({where:{ id:req.body.subcategory_id }})
    if(!subcategory) throw  new apiError(404,"Invalid Subcategory")

    const image_path = req.file.path;
    if (!image_path)  throw new apiError(404, "Image Path Is Required To Upload Image");

    const product = await Product.create({
        product_title:req.body.title,
        product_description:req.body.description,
        subcategory_id:req.body.subcategory_id,
        price:req.body.price,
        product_image_path:image_path,
        createdBy:req.user.id
    })
    if(!product) throw new apiError(500,"Error Createing Product")
    res.status(200).json(
        new apiResponse(200,"Product Created SuccessFully",product)
    )
}

const ctrlDeleteProduct = async(req,res)=>{

    const product = await Product.findByPk(req.body.id)
    if(!product) throw new apiError(404,"No Product Found With This ID")
    
    if(req.user.id !== product.id && req.user.role === 'user') throw new apiError(410,"Unauthorized Access")
    
    product.is_delete = true
    await product.save()

    res.status(200).json(
        new apiResponse(200,"Product Deleted SuccesFully")
    )
}

const ctrlUpdateProduct = async(req,res)=>{

    const product = await Product.findByPk(req.body.id)
    if(!product) throw new apiError(404,"No Product Found With This Credtinals")
    if(product.createdBy !== req.user.id && req.user.role === 'user') throw new apiError(410,"Unauthorized Access")
    const updatedData = {};
    if (req.body.title) updatedData.product_title = req.body.title;
    if (req.body.description) updatedData.product_description = req.body.description;
    if (req.body.subcategory_id) updatedData.subcategory_id = req.body.subcategory_id;
    if(req.body.price) updatedData.price = req.body.price
    if (req.file && req.file.path) {
        const oldFilePath = path.join(__dirname, "..", "..", product.product_image_path);
        console.log(oldFilePath);
        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
        }
        updatedData.product_image_path = req.file.path
      }
    
      if (JSON.stringify(updatedData) === '{}') {
        throw new apiError(404, "One Of The Flied Is Required To Update");
      }
    const recordcheck = await Product.findOne({where:{[Op.or]:{...updatedData}}})
    if(recordcheck) throw new apiError(410,"Can't Updated Recored With This Creditinals Already Exists")
      updatedData.createdBy = req.user.id
      const upatedProduct = await product.update(updatedData);
    
      res
        .status(200)
        .json(
          new apiResponse(
            200,
            upatedProduct,
            "Product Updated Successfully"
          )
        );
}

const ctrlGetAllProduct = async(req,res)=>{
    const products = await Product.findAll({
        where:{ is_delete:false },
        include:{
            model:Subcategory,
            include: [ db.Category ],
            raw:true
        }
    })
    if(!products) throw new apiError(404,"No Products Found")

    const newdata  = products.map((subproduct)=>{
        const product = subproduct.toJSON()
        const Subcategory = product.Subcategory
        const category =  Subcategory.Category

        delete product.Subcategory
        return {
            ...product,
            SubCategory_title: Subcategory.subcategory_title,
            SubCategory_description: Subcategory.subcategory_description,
            SubCategory_Image: Subcategory.subcategory_image_path,
            Category_title: category.title,
            Category_id: category.id,
            Category_description: category.description,
            Category_Image: category.image_path,
        }
    })
    res.status(200).json(
        new apiResponse(200,"All Product Fetched SuccessFully",newdata)
    )
}

module.exports = {
    ctrlCreateProduct,
    ctrlDeleteProduct,
    ctrlGetAllProduct,
    ctrlUpdateProduct
}