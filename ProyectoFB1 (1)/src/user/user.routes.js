import { Router } from "express"
import { deletUser, login, register, test, update, updateClient } from "./user.controller.js"
import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js"
const api = Router()

//Admin Routes
api.get('/test', test)
api.put('/updateClient', [validateJwt, isAdmin], updateClient)


//Client Routes
api.put('/update/', [validateJwt], update)
api.delete('/delete/:id', [validateJwt], deletUser)

//Public Routes
api.post('/register', register)
api.post('/login', login)


export default api
