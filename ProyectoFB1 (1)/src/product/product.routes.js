import { Router } from "express"
import { add, deleteProduct, displayProducts, search, soldOut, update } from "./product.controller.js"
import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js"

const api = Router()

//Admin Routes
api.post('/add',[validateJwt, isAdmin], add)
api.put('/update/:id',[validateJwt, isAdmin], update)
api.delete('/delete:/id',[validateJwt, isAdmin],deleteProduct)

//Client Routes
api.post('/display',[validateJwt],displayProducts)
api.post('/search',/*[validateJwt],*/search)
api.get('/soldOut',[validateJwt], soldOut)

export default api