const jwt  = require('jsonwebtoken')
const dotenv = require('dotenv')
const { apiError } = require('../utils/apiError')

dotenv.config()

const auth = async(req,res,next)=>{
    const authHeader = req.headers.auth;

    if(!authHeader && authHeader?.startsWith("Bearer ")){
        throw new apiError(404,"No Token Found Unauthorized Access")
    }

    const token = authHeader
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        throw new apiError(402,"Invalid Or Expired Token",error)
    }
}

module.exports = auth;