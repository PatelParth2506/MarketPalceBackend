const { apiError } =  require('../utils/apiError')
const { apiResponse } = require('../utils/apiResponse')
const db =require('../models/index')
const { where } = require('sequelize')
const Address = db.Address
const { HTTP_STATUS,HTTP_CODE } = require('../utils/constans')

const ctrlCreateAddress = async(req,res)=>{

    const addressCheck = await Address.findOne({where:{user_id: req.user.id,apartment:req.body.apartment}})
    if(addressCheck) throw new apiError(HTTP_STATUS.BAD_REQUEST,"Address Already Exists With This Creditnsals")

    const address = await Address.create({
        pinCode:req.body.pinCode,
        apartment:req.body.apartment,
        landmark:req.body.landmark,
        state:req.body.state,
        city:req.body.city,
        user_id:req.body.user_id || req.user.id,
        createdBy:req.user.id
    })
    if(!address) throw new apiError(HTTP_STATUS.INTERNAL_SERVER_ERROR,"Error Creating New Address")
    
    res.status(HTTP_STATUS.CREATED).json(
        new apiResponse(HTTP_CODE.CREATED,"Address Created SuccessFully",address)
    )
}

const ctrlDeleteAddress = async(req,res)=>{

    const address = await Address.findByPk(req.body.id)
    if(!address) throw new apiError(HTTP_STATUS.DATA_NOT_FOUND,"Address Not Found")
    
    if(address.user_id !== req.user.id && req.user.role === 'user') throw new apiError(HTTP_STATUS.UNAUTHORIZED,"Unauthorized Access")
    address.is_delete= true
    address.updatedBy = req.user.id
    await address.save()
    res.status(HTTP_STATUS.OK).json(
        new apiResponse(HTTP_CODE.OK,"Address Deleted SuccessFully")
    )
}

const ctrlUpdateAddress = async(req,res)=>{

    const address = await Address.findByPk(id)
    if(!address) throw new apiError(HTTP_STATUS.DATA_NOT_FOUND,"No Address Found")
    if(req.user.id !== address.user_id) throw new apiError(HTTP_STATUS.UNAUTHORIZED,"Unauthorized Access")
    const updatedData = {}
    if(req.body.pinCode) updatedData.pinCode = req.body.pinCode
    if(req.body.apartment) updatedData.apartment = req.body.apartment
    if(req.body.landmark) updatedData.landmark = req.body.landmark
    if(req.body.state) updatedData.state = req.body.state
    if(req.body.city) updatedData.city = req.body.city

    if(Object.keys(updatedData).length === 0) throw new apiError(HTTP_STATUS.BAD_REQUEST,"One Of The Feild Is Required To Update Address")
    updatedData.user_id = req.user.id
    updatedData.updatedBy = req.user.id
    await address.update(updatedData)
    res.status(HTTP_STATUS.OK).json(
        new apiResponse(HTTP_CODE.OK,"Address Updated SuccessFully",address)
    )
}

const ctrlGetAddressByUserId = async(req,res)=>{
    const address = await Address.findAll({where:{ user_id:req.body.user_id || req.user.id}})
    if(!address) throw new apiError(HTTP_STATUS.DATA_NOT_FOUND,"No Address Found")
    res.status(HTTP_STATUS.OK).json(
        new apiResponse(HTTP_CODE.OK,"Address Fetched SuccessFully",address)
    )
}

module.exports = {
    ctrlCreateAddress,
    ctrlDeleteAddress,
    ctrlGetAddressByUserId,
    ctrlUpdateAddress
}