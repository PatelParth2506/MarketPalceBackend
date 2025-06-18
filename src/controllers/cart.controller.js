const { apiError } =  require('../utils/apiError')
const { apiResponse } = require('../utils/apiResponse')
const db =require('../models/index')
const { where } = require('sequelize')
const { raw } = require('mysql2')
const Cart = db.Cart

const ctrlAddToCart = async(req,res)=>{

    const product = await Cart.findOne({where:{user_id:req.user.id,product_id:req.body.product_id}})
    if(product){
        product.quentity += req.body.quentity
        await product.save()
    }else{
        const cart = await Cart.create({
            user_id:req.user.id,
            product_id:req.body.product_id,
            quentity:req.body.quentity
        })
    }
    res.status(200).json(
        new apiResponse(200,"Product Added To Cart")
    )
}

const ctrlRemoveCart = async(req,res)=>{

    const cart = await Cart.findByPk(id)
    if(!cart) throw new apiError(404,"No Cart Found With This Details")
    if(cart.user_id !== req.user.id) throw new apiError(410,"Unauthorized Access")
    await cart.destroy()
    res.status(200).json(
        new apiResponse(200,"Cart Removed SuccessFully")
    )
}

const ctrlUpdateQuentity = async(req,res)=>{

    const cart = await Cart.findByPk(req.body.id)
    if(!cart) throw new apiError(404,"No Cart Found")
    if(cart.user_id !== req.user.id) throw new apiError(410,"Unauthorized Access")
    cart.quentity = req.body.quentity
    await cart.save()
    res.status(200).json(
        new apiResponse(200,"Quentity Updated SuccessFully",cart)
    )
}

const ctrlGetCartById = async(req,res)=>{
     const cart = await Cart.findAll({
        where:{user_id : req.user.id},
        include:[db.Product],
        raw:true
    })

    if(!cart) throw new apiError(404,"No Cart Item Found")
    res.status(200).json(
        new apiResponse(200,"Cart Fetched SuccesFully",cart)
    )
}

const ctrlGetAllCart = async(req,res)=>{
    const cart = await Cart.findAll({
        include:[db.Product,db.User],
        raw:true
    })
    if(!cart) throw new apiError(404,"No Cart Item Found")
    res.status(200).json(
        new apiResponse(200,"Cart Fetched SuccesFully",cart)
    )
}

module.exports = {
    ctrlAddToCart,
    ctrlGetAllCart,
    ctrlGetCartById,
    ctrlRemoveCart,
    ctrlUpdateQuentity
}