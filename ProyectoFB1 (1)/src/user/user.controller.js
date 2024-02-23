import User from './user.model.js'
import { aencrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) => {
    return res.send('All running ')
}

export const register = async (req, res) => {
    try {
        let data = req.body
        data.password = await aencrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({ message: 'Registered successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error registering user', error })

    }
}

export const login = async (req, res) => {
    try {
        //Capturar la información (body)
        let { username, email, password } = req.body
        //Validar que el usuario existe
        let user = await User.findOne({ $or:[{username},{email}]})
        //Verifico que la contraseña coincida
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            //Responder (dar acceso)
            return res.send(
                {
                    message: `Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Failed to login' })
    }
}

// localhost/user/update
// localhost/update/:userId

export const update = async (req, res) => {
    try {
        // let { id } = req.params
        let data = req.body
        let user = req.user
        let updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            data,
            { new: true }
        )
        if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
        return res.send({ message: 'Updated user', updatedUser })
    } catch (error) {
        console.error(error)
        if(error.keyValue.username) return res.status(400).send({message: `Username ${error.keyValue.username} is already taken`})
        return res.status(500).send({ message: 'Error updating account' })
    }
}

export const updateClient = async(req, res)=>{
    try {
        let {id} = req.params
        let data = req.body
        let updatedUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
        return res.send({ message: 'Updated user', updatedUser })
    } catch (error) {
        console.error(error)
        if(error.keyValue.username) return res.status(400).send({message: `Username ${error.keyValue.username} is already taken`})
        return res.status(500).send({ message: 'Error updating account' })
    }
}


export const deletUser = async (req, res) => {
    try {
        let { id } = req.params
        let deletedUser = await User.findOneAndDelete({ _id: id })
        if (!deletedUser) return res.status(404).send({ message: 'Account not found and not deleted' })
        return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error deleting account', error })
    }
}