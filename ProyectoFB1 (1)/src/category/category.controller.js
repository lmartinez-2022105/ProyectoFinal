import { checkUpdate } from '../utils/validator.js'
import Category from './category.model.js'
import Product from '../product/product.model.js'

export const test = (req, res)=>{
    res.send('all categorys')
}

export const add = async(req, res)=>{
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({message: 'Registered successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error registering user', error})
    }
}

export const update = async(req, res)=>{
    try {
        let {id} = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have sumbmitted some data that cannot be updated or missing data'})
        let updatedCategory = await Category.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}    
        )
        if(!updatedCategory) return res.status(401).send({message: 'Category not found and not updated'})
        return res.send({message: 'Updated category', updatedCategory})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const deleteCategory = async(req, res)=>{
    try {
        let { id } = req.params
         let deletedCategory = await Category.findOneAndDelete({_id: id})
         if(!deletedCategory) return res.status(404).send({message: 'Category not found and not deleted'})
         let categoryDe = '6f2d8c1e5a3b4f9d7e0a8b2c'
         let defaultC = await Category.findOne({_id: categoryDe})
         await Product.updateMany({category: id},{$set:{category: defaultC._id}})
         return res.send({message: `Category with name ${deletedCategory.name} deleted successfully`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting category', error})
    }
}

export const display = async(req, res)=>{
    try {
        let category = await Category.find()
        return res.send(category)
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error displaying categories'})
    }
}