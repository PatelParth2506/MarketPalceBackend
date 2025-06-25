const db = require('../models/index')
const ActivityLog = db.Userctivitylog
const activity = async(req,res,next)=>{
  try {
    await ActivityLog.create({
      userId : req.user?.user_id || null,
      method : req.method,
      orignalUrl : req.originalUrl,
      body : req.body,
      query : req.query
    })
  } catch (error) {
    console.log("Error Creating ActivityLog",error)    
  }
  next()
}

module.exports = activity