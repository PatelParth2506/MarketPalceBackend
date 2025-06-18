const express = require('express')
const { apiError } = require('./src/utils/apiError')
const userRoutes = require('./src/routes/user.route')
const categoryRoutes = require('./src/routes/category.route')
const subcategoryRoutes = require('./src/routes/subcategory.route')
const productRoutes = require('./src/routes/product.routes')
const addressRoutes = require('./src/routes/address.route')
const cartRoutes = require('./src/routes/cart.route')

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

app.use((err, req, res, next) => {
    if (err instanceof apiError) {

      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors,
        data: null,
        stack: err.stack = undefined,
      });
    }
  
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: [err.message],
      data: null,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});

app.listen(3000,()=>{
    console.log("App Is Running In Port 3000")
})