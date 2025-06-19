const { apiError } = require('../utils/apiError')
const { apiResponse } = require('../utils/apiResponse')
const db = require('../models/index')
const { fn, col, Op } = require('sequelize')
const Order =db.Order
const Product = db.Product
const OrderProduct = db.OrderProduct

const ctrlPlaceOrder = async(req,res)=>{
    const { order_items } = req.body

    let totalPrice = 0;
    let orderData = []
    for(const item of order_items){
        const product = await Product.findByPk(item.id)
        if(!product) throw new apiError(404,`No Product Found With ${item.id} Id`)
        
        const price = product.price * item.quentity
        totalPrice += price

        orderData.push({
            product_id : product.id,
            product_name : product.product_title,
            product_price : product.price,
            quentity : item.quentity
        })
    }

    const order = await Order.create({
        user_id:req.user.id,
        totalPrice,
        order_status : 'pending'
    })
    if(!order) throw new apiError(500,"Error Creating Order")
    for(const op of orderData){
        await OrderProduct.create({
            order_id:order.id,
            ...op
        })
    }
    res.status(200).json(
        new apiResponse(200,"Order Created SuccessFully",order)
    )
}

const ctrlUpdateProduct_status = async(req,res)=>{
    const order = await Order.findByPk(req.body.id)
    if(!order) throw new apiError(404, " No Order Found With This Details ")
    if(order.user_id !== req.user.id && req.user.role === 'user') throw new apiError(410,"Unauthorized Access")
    order.order_status = req.body.order_status
    await order.save()
}

const ctrlGetAllOrders = async(req,res)=>{
    let orders
    if(req.user.role === 'user') {
        orders = await Order.findAll({
            where:{ user_id : req.user.id },
            include:{
                model:db.OrderProduct,
                attributes: ['product_id', 'product_name', 'product_price', 'quentity']
            }
        })        
    }else{
        orders = await Order.findAll({include:{
                model:db.OrderProduct,
                attributes: ['product_id', 'product_name', 'product_price', 'quentity']
            }})
    }
    if(!orders) throw new apiError(404,"No Orders Found")
    res.status(200).json(
        new apiResponse(200,"All Orders Fetched SuccessFully",orders)
    )
}

const ctrlGetSingleOrder = async(req,res)=>{
    
    const order = await Order.findByPk(req.body.id,{
        include:{
                model:db.OrderProduct,
                attributes: ['product_id', 'product_name', 'product_price', 'quentity']
            }
    })
    if(!order) throw new apiError(404,"No Order Found")
    if(order.user_id !== req.user.id && req.user.role === 'role') throw new apiError(410,"Unauthorized Access")

    res.status(200).json(
        new apiResponse(200,"Order Fetched SuccessFullly",order)
    )
}

const ctrlGetOrderStats = async(req,res)=>{
    if(req.user.role === 'user') throw new apiError("You Don't Have Access To This Api")
    
    const totalOrders= await Order.count()
    const orderstatus = await Order.findAll({
        attributes: [
        'order_status',
        [fn('COUNT', col('order_status')), 'count']
      ],
      group: ['order_status']
    })

    const map = {
        pending : 0,
        delivered : 0,
        rejected : 0
    }

    orderstatus.forEach(element => {
        map[element.order_status] = parseInt(element.dataValues.count);
    });

    const revenue = await Order.findOne({
        attributes:[[fn('SUM',col('totalPrice')),'sum']]
    })

    const totalRevenue = parseInt(revenue.dataValues.sum || 0)
    res.json(
        new apiResponse(200,"",{totalRevenue,totalOrders,...map
        })
    )
}

module.exports = { 
    ctrlPlaceOrder,
    ctrlUpdateProduct_status,
    ctrlGetAllOrders,
    ctrlGetSingleOrder,
    ctrlGetOrderStats
}