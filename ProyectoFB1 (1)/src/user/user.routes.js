import { Router } from "express"
import { deletUser, displayClient, login, register, test, update, updateClient } from "./user.controller.js"
import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js"
const api = Router()

//Admin Routes
api.get('/test', test)
api.put('/updateClient/:id', [validateJwt, isAdmin], updateClient)
api.get('/client', [validateJwt, isAdmin], displayClient)

//Client Routes
api.put('/update', [validateJwt], update)
api.delete('/delete/:id', [validateJwt], deletUser)

//Public Routes
api.post('/register', register)
api.post('/login', login)


export default api
