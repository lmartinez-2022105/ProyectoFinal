import { connect } from './configs/mongo.js'
import { InitServer } from './configs/app.js'
import User from './src/user/user.model.js'
import { aencrypt } from './src/utils/validator.js'


const userDefault = async()=>{
    try {
        const existUser = await User.findOne()
        if(!existUser){
            const newUser = new User({
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
            await newUser.save()
            console.log('User default created', newUser)
        }
         console.log('User default already exists')
    } catch (error) {
        console.error(error)
        return error
    }
}

userDefault()
InitServer()
connect()