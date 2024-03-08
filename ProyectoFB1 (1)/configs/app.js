import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
import userRoutes from '../src/user/user.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import productRoutes from '../src/product/product.routes.js'
import shoppingCarRoutes from '../src/shopCar/shopCar.routes.js'
import purchaseRouter from '../src/purchase/purchase.routes.js'
 
//Configuraciones
const app = express() 
config()
const port = process.env.PORT || 2666



//Configuraciones del server
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

//Rutas
app.use("/user", userRoutes)
app.use('/category', categoryRoutes)
app.use('/product', productRoutes)
app.use('/shop', shoppingCarRoutes)
app.use('/buy', purchaseRouter)


//Levantar el server
export const InitServer = ()=>{
    app.listen(port)
    console.log(`Server HTTPS is running in port ${port}`)
}