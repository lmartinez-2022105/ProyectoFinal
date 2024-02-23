import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
import User from '../src/user/user.model.js'
import userRoutes from '../src/user/user.routes.js'
import categoryRoutes from '../src/category/category.routes.js'

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

const userDefault = async()=>{
    try {
        const existUser = await User.findOne()
        if(!existUser){
            const newUser = new User({
                name:"José",
                surname:"Lutin",
                username: "josejose",
                password:"abcd1234",
                address: "13 calle zona 3 Guatemala City",
                country: "Ugand",
                phone: "32451689",
                role: "ADMIN" 
            })
            await newUser.save()
            console.log('User default created', newUser)
        }
    } catch (error) {
        console.error(error)
        return error
    }
}

//Levantar el server
export const InitServer = ()=>{
    userDefault()
    app.listen(port)
    console.log(`Server HTTPS is running in port ${port}`)
}