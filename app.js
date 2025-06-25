const express = require('express')
const { apiError } = require('./src/utils/apiError')
const userRoutes = require('./src/routes/user.route')
const categoryRoutes = require('./src/routes/category.route')
const subcategoryRoutes = require('./src/routes/subcategory.route')
const productRoutes = require('./src/routes/product.routes')
const addressRoutes = require('./src/routes/address.route')
const cartRoutes = require('./src/routes/cart.route')
const orderRoutes = require('./src/routes/order.route')
const discountRoutes = require('./src/routes/discount.route')
const { HTTP_CODE, HTTP_STATUS } = require('./src/utils/constans')
const db = require('./src/models/index')
const ErrorLog = db.ErrorLog
const ActivityLog = db.Userctivitylog

const app = express()

app.use(express.json({limit:"16kb"}))
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))


app.use('/auth',userRoutes)
app.use('/category',categoryRoutes)
app.use('/subCategory',subcategoryRoutes)
app.use('/product',productRoutes)
app.use('/address',addressRoutes)
app.use('/cart',cartRoutes)
app.use('/order',orderRoutes)
app.use('/discount',discountRoutes)

app.use(async(err, req, res, next) => {
  try {
      await ErrorLog.create({
      stack:err.stack,
      message:err.message,
      requestUrl:req.originalUrl,
    })
    } catch (error) {
      console.log(error)
    }
    if (err instanceof apiError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors,
        data: null,
        stack: err.stack = undefined,
      });
    }
  
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      errors: [err.message],
      data: null,
      stack:err.stack
    });
});


app.listen(3000,()=>{
    console.log("App Is Running In Port 3000")
})