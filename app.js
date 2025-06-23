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
// const session = require('express-session')
// const cookie = require('express-session/session/cookie')
// const sequelizeSession = require('connect-session-sequelize')(session.Store)
// const sequelize = require('./config/db')
// const sequelizeStore = new sequelizeSession({
//   db:sequelize,
//   checkExpirationInterval:15*60*1000,
//   expiration:24 * 60 * 60 * 1000,
//   extendDefaultFields: (defaults, session) => {
//     return {
//       data: defaults.data,
//       expires: defaults.expires,
//       userId: session.userId 
//     }
//   },
// })
const app = express()

app.use(express.json({limit:"16kb"}))
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))
// app.use(session({
//   secret:'This Is Session Secret',
//   store:sequelizeStore,
//   resave:false,
//   proxy:true,
//   saveUninitialized:false,
      // cookie:{
      //   maxAge: 24 * 60 * 60 * 1000
      // }
// }))


app.use('/auth',userRoutes)
app.use('/category',categoryRoutes)
app.use('/subCategory',subcategoryRoutes)
app.use('/product',productRoutes)
app.use('/address',addressRoutes)
app.use('/cart',cartRoutes)
app.use('/order',orderRoutes)
app.use('/discount',discountRoutes)

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
  
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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