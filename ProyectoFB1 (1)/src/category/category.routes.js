import { Router } from "express"
import { add, deleteCategory, test, update } from "./category.controller.js"
import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js"
const api = Router()

//Clients Routes


//Admin Routes
api.get('/test',[validateJwt, isAdmin], test)
api.post('/add', add)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteCategory)

export default api