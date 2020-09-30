const express = require('express')
const app = express(); 
const mongoose = require('mongoose');
//import middleware
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const CORS = require('cors')
//import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')


require('dotenv').config()

// DB connection 
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex: true
    })
    .then( ()=>console.log('Databse connected!') )
    .catch( ()=>console.log(`Could not connect to DB`) )


//middleware 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(CORS())



//Routes Middleware - declares top level route as /api
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)
app.use("/api", orderRoutes)



//PORT 
const port = process.env.PORT ||  8000; 

//Sever Start
app.listen( port, ()=>{console.log(`listening on localhost:${port}`)})