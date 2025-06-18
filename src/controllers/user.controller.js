const { apiError } =  require('../utils/apiError')
const { apiResponse } = require('../utils/apiResponse')
const db =require('../models/index')
const { where } = require('sequelize')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const User = db.User

dotenv.config()

const ctrlCreateUser = async(req,res)=>{
    if(req.user.role === 'user') throw new apiError(410,"Unauthorized Access You Don't Have Access To Create User")
    if(req.user.role === 'admin' && req.body.role === 'admin') throw new apiError(410,"Unauthorized Access You Don't Have Access To Create User")
    const usercheck = await User.findOne({where:{email:req.body.email,username:req.body.username}})
    if(usercheck) throw new apiError(401,"User Already Exists With This Creditnals")
    const user = await User.create({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        mobileNo:req.body.mobileNo,
        role:req.body.role,
        createdBy:req.user.id
    })
    if(!user) throw new apiError(500,"Internal Server Error")
    res.status(200).json(
        new apiResponse(200,"User Created SuccessFully",user)
    )
}

const ctrlLogin = async(req,res)=>{

    const usercheck = await User.findOne({where:{email:req.body.email}})
    if(!usercheck) throw new apiError(404,"No User Found With This Cradintals")
    if(usercheck.password !== req.body.password) throw new apiError(410,"Invalid Password")
    const token = jwt.sign(
        { id: usercheck.id, username: usercheck.username, role: usercheck.role },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRY,
        })
    res.status(200).json(
        new apiResponse(200,"User LoggedIn SuccessFully",[usercheck,token])
    )
}

const ctrlGetallUsers = async(req,res)=>{
    if(!req.user) throw new apiError(410,"Unauthorized Access Login To Continue")
    const users = await User.findAll({where:{is_delete:false}})
    if(!users) throw new apiError(404,"No User Found")
    res.status(200).json(
        new apiResponse(200,"All User Fetched SuccessFully",users)
    )
}

const ctrlUpdateUser = async(req,res)=>{

    const usercheck = await User.findOne({where:{id:req.body.id}})
    if(!usercheck) throw new apiError(404,"No User Found With This Credentials")
     if(usercheck.id !== req.user.id && req.user.role === 'user') throw new apiError(410,"Unauthorized Access")
    const updatedData = {}
    if(req.user.id) updatedData.updatedBy = usercheck.id
    if(req.body.email) updatedData.email = req.body.email
    if(req.body.mobileNo) updatedData.mobileNo = req.body.mobileNo
    if(req.body.username) updatedData.username = req.body.username
    if(req.body.password) updatedData.password = req.body.password
    if(req.body.role) updatedData.role = req.body.role

    if(JSON.stringify(updatedData) === '{}') throw new apiError(404,"One Of The Feild Is Required To Update")
   await usercheck.update(updatedData) 

    res.status(200).json(
        new apiResponse(200,"Data Updated SuccessFully",usercheck)
    )
}

const ctrlDeleteUser = async(req,res)=>{

    const user = await User.findByPk(req.body.id)
    if(!user) throw new apiError(404,"No User Found")
    if(user.id !== req.user.id || req.user.role === 'user') throw new apiError(410,"Unauthorized Access")
    user.updatedBy = req.user.id
    user.is_delete = true
    await user.save()
    res.status(200).json(
        new apiResponse(200,"User Deleted SuccessFully",[])
    )
}

module.exports = { 
    ctrlCreateUser,
    ctrlDeleteUser,
    ctrlGetallUsers,
    ctrlLogin,
    ctrlUpdateUser
}
