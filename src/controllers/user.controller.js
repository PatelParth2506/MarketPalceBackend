const { apiError } = require("../utils/apiError");
const { apiResponse } = require("../utils/apiResponse");
const { where } = require("sequelize");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { HTTP_CODE, HTTP_STATUS } = require("../utils/constans");
const db = require("../models/index");
const User = db.User;
const Session = db.Session;
const UserLog = db.UserLog
const activityLog = require('../utils/activityLog')
dotenv.config();

const createAccessToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const ctrlCreateUser = async (req, res) => {
  if (req.user.role === "user"){
    throw new apiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Unauthorized Access You Don't Have Access To Create User"
    );
  }
  if (req.user.role === "admin" && req.body.role === "admin"){
    throw new apiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Unauthorized Access You Don't Have Access To Create User"
    );
  }

  const usercheck = await User.findOne({
    where: { 
        email: req.body.email, 
        username: req.body.username 
    },
  });
  if (usercheck){
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "User Already Exists With This Creditnals"
    );
  }
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    mobileNo: req.body.mobileNo,
    role: req.body.role,
    createdBy: req.user.user_id,
  });
//  const user= await db.sequelize.query(
//   `INSERT INTO tbl_market_user 
//     (username, email, password, mobileNo, role, createdBy,createdAt,updatedAt) 
//    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//   {
//     replacements: [
//       req.body.username,
//       req.body.email,
//       req.body.password,
//       req.body.mobileNo,
//       req.body.role,
//       req.user.user_id,
//       new Date(),
//       new Date()
//     ],
//     type: db.Sequelize.QueryTypes.INSERT
//   }
// )
  if (!user){
    throw new apiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error"
    );
  }
  await activityLog(user,UserLog)

  res
    .status(HTTP_STATUS.CREATED)
    .json(
      new apiResponse(HTTP_CODE.CREATED, "User Created SuccessFully", user)
    );
};

const ctrlLogin = async (req, res) => {
  const usercheck = await User.findOne({ 
    where: { 
        email: req.body.email 
    } 
  });
  if (!usercheck){
    throw new apiError(
      HTTP_STATUS.DATA_NOT_FOUND,
      "No User Found With This Cradintals"
    );
  }
  
  if (usercheck.password !== req.body.password){
    throw new apiError(HTTP_STATUS.BAD_REQUEST, "Invalid Password");
  }
  
  const genrefreshtoken = createRefreshToken(usercheck);
  const session = await Session.create({
    refreshToken: genrefreshtoken,
    user_id: usercheck.user_id,
    ip_address: req.ip,
    agent: req.headers["user-agent"],
  });
  const accessToken = createAccessToken(usercheck);
  
  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(HTTP_CODE.OK, "User LoggedIn SuccessFully", [
        usercheck,
        accessToken,
        session,
      ])
    );
};

const ctrlGetallUsers = async (req, res) => {
  if (req.user.role === "user"){
    throw new apiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Unauthorized Access Login To Continue"
    );
  }

  const users = await User.findAll({ 
    where: {
        is_delete: false 
    },
  });
  if (!users){ 
    throw new apiError(HTTP_STATUS.NOT_FOUND, "No User Found");
  }
  
  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(HTTP_CODE.OK, "All User Fetched SuccessFully", users)
    );
};

const ctrlUpdateUser = async (req, res) => {
  const usercheck = await User.findOne({ 
    where: { 
        user_id: req.body.user_id
    } 
  });
  if (!usercheck){
    throw new apiError(
      HTTP_STATUS.NOT_FOUND,
      "No User Found With This Credentials"
    );
  }
  
  if (usercheck.user_id !== req.user.user_id && req.user.role === "user"){
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
  }
  
  const updatedData = {};
  if (req.body.email){ 
    updatedData.email = req.body.email;
  }
  if (req.body.mobileNo){ 
    updatedData.mobileNo = req.body.mobileNo;
  }
  if (req.body.username){ 
    updatedData.username = req.body.username;
  }
  if (req.body.password){ 
    updatedData.password = req.body.password;
  }
  if (req.body.role){ 
    updatedData.role = req.body.role;
  }
  if (JSON.stringify(updatedData) === "{}"){
    throw new apiError(
      HTTP_STATUS.DATA_NOT_FOUND,
      "One Of The Feild Is Required To Update"
    );
  }
  updatedData.updatedBy = req.user.user_id;
  
  await usercheck.update(updatedData);
  await activityLog(usercheck,UserLog)
  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(HTTP_CODE.OK, "Data Updated SuccessFully", usercheck)
    );
};

const ctrlDeleteUser = async (req, res) => {
  const user = await User.findByPk(req.body.user_id);
  if (!user){
    throw new apiError(HTTP_STATUS.NOT_FOUND, "No User Found");
  }
  
  if (user.user_id !== req.user.user_id || req.user.role === "user"){
    throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
  }
  
  user.updatedBy = req.user.user_id;
  user.is_delete = true;
  
  await user.save();
  await activityLog(user,UserLog)
  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "User Deleted SuccessFully", []));
};

const ctrlGenrateAccessToken = async (req, res) => {
  const session = await Session.findOne({
    where: { 
        refreshToken: req.body.refreshToken 
    },
    include: {
      model: User,
      attributes: ["role", "username"],
    },
  });
  if (!session) throw new apiError(HTTP_STATUS.UNAUTHORIZED, "Invalid Token");
  
  const accessToken = jwt.sign({
    user_id: session.user_id,
    username: session.User.username,
    role: session.User.role,
  });
  if (!accessToken){
    throw new apiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error Genrating AccessToken"
    );
  }
  
  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(
        HTTP_CODE.OK,
        "AccessToken Genrated SuccessFully",
        accessToken
      )
    );
};

const ctrlGetAllLoggedInUser = async (req, res) => {
  const user = await User.findByPk(req.body.user_id, {
    include: [ Session ],
  });
  if (!user) throw new apiError(HTTP_STATUS.NOT_FOUND, "User Not Found");
  console.log("Not Coming")
  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "User Fetched SuccessFully", user));
};

const ctrlLogoutSingleUser = async (req, res) => {
  const session = await Session.findOne({
    where: { 
        refreshToken: req.body.refreshToken 
    },
  });
  if (!session){
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "No User Found With This Creditinsals"
    );
  }

  await session.destroy();
  
  res
    .status(HTTP_STATUS.OK)
    .json(new apiResponse(HTTP_CODE.OK, "User Logged Out SuccessFully", []));
};

const ctrlLogoutAllUser = async (req, res) => {
  const session = await Session.findOne({
    where: { 
        refreshToken: req.body.refreshToken, 
        user_id: req.body.user_id
    },
  });
  if (!session){
    throw new apiError(
      HTTP_STATUS.BAD_REQUEST,
      "No User Found With This Creditinsals"
    );
  }
  
  const user = await User.findByPk(req.body.user_id);
  user.tokenVersion += 2;
  await user.save()
  await activityLog(user,UserLog)
  await Session.destroy({ 
    where: { 
        user_id: req.body.user_id 
    } 
  });
  
  res
    .status(HTTP_STATUS.OK)
    .json(
      new apiResponse(HTTP_CODE.OK, "User Logged Out SuccessFully", session)
    );
};

module.exports = {
  ctrlCreateUser,
  ctrlDeleteUser,
  ctrlGetallUsers,
  ctrlLogin,
  ctrlUpdateUser,
  ctrlGenrateAccessToken,
  ctrlGetAllLoggedInUser,
  ctrlLogoutSingleUser,
  ctrlLogoutAllUser,
};
