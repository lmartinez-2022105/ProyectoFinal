import { Router } from "express"
import { addToCart, remove, testShopCar, update, view } from "./shopCar.controller.js"
import { validateJwt } from "../middlewares/validate-jwt.js"

const api = Router()

//Admin Routes
api.get('/test', testShopCar)

//Clients Routes
api.post('/add',[validateJwt], addToCart)
api.delete('/remove/:id',[validateJwt], remove)
api.put('/update/:id',[validateJwt], update)
api.get('/view',[validateJwt], view)



export default api