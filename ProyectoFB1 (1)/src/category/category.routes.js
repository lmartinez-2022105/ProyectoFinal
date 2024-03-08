import { Router } from "express"
import { add, deleteCategory, display, test, update } from "./category.controller.js"
import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js"
const api = Router()

//Clients Routes


//Admin Routes
api.get('/test',[validateJwt, isAdmin], test)
api.post('/add',[validateJwt, isAdmin], add)
api.put('/update/:id',[validateJwt, isAdmin], update)
api.delete('/delete/:id',[validateJwt, isAdmin], deleteCategory)
//ClientsRoutes
api.get('/display',[validateJwt],display)

export default api