import Category from '../category/category.model.js'
import User from '../user/user.model.js'
import { aencrypt } from './validator.js'
import mongoose from 'mongoose'

export const categoryDefault = async()=>{
    try {
        let id = '6f2d8c1e5a3b4f9d7e0a8b2c'
        let existCategory = await Category.findOne({_id:id})
        if(!existCategory){
            let newCategory = new Category({
                _id: new mongoose.Types.ObjectId('6f2d8c1e5a3b4f9d7e0a8b2c'),
                name: 'defaultCategory',
                description: 'Default Category'
            })
            await newCategory.save()
            console.log('Category default created', newCategory)
        }
        console.log('Category default already exists')
    } catch (error) {
        console.error(error)
        return error
    }
}

export const userDefault = async()=>{
    try {
        let existUser = await User.findOne()
        if(!existUser){
            let newUser = new User({
                name:"José",
                surname:"Lutin",
                username: "josejose",
                email: "josejose@gmail.com",
                password: "abcd1234",
                address: "13 calle zona 3 Guatemala City",
                country: "Ugand",
                phone: "32451689",
                role: "ADMIN" 
            })
            newUser.password = await aencrypt(newUser.password)
            console.log(newUser.password)
            await newUser.save()
            console.log('User default created', newUser)
        }
         console.log('User default already exists')
    } catch (error) {
        console.error(error)
        return error
    }
}
