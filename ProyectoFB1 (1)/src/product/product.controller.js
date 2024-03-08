import Product from './product.model.js'

export const add = async(req, res)=>{
    try {
        let data = req.body
        let product = new Product(data)
        await product.save()
        return res.send({message: 'Registered successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error registering product', error})
    }
}

export const update = async(req, res)=>{
    try {
        let {id} = req.params
        let data = req.body
        let updateProduct = Product.findOneAndUpdate({_id:id}, data, {new:true})
        if(!updateProduct) res.status(400).send({message:'Product not foun and not updated'})
        res.send({message: 'Product updated', updateProduct})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error updating product',error})
    }
}

export const deleteProduct = async(req, res)=>{
    try {
        let {id} = req.params
        let deletedProduct = Product.findOneAndDelete({_id:id})
        if(!deletedProduct) res.status(400).send({message:'Product not found and not deleted'})
        res.send({message:'Product deleted successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error deleting product',error})
    }
}

export const displayProducts = async(req,res)=>{
    try {
        let products =await Product.find().populate('category',['name','description'])
        console.log(products.category)
        res.send(products)
    } catch (error) {
        console.error(error)
        res.status(500).send({message:'Error displaying products'})
    }
}

//Filtros

export const search = async (req, res) => {
    try {
        let { category, name } = req.body
        let products
        if(!category && !name){
            products = await Product.find().sort({ sellCount: -1 }).populate('category', ['name', 'description'])
            return res.send({ message: 'If you do not enter a name or category, the products will be ordered by "best sellers"', products })
        }
        if (!name) {
            products = await Product.find({ category: category }).populate('category',['name','description'])
            return res.send(products)
        } 
        if (!category) {
            const product = await Product.find({ name: {$regex:new RegExp(name, 'i')} }).populate('category',['name','description'])
            return res.send(product)
        }else{
            products = await Product.find({ name:name,category: category }).populate('category',['name','description'])
            return res.send(products)
        }
        
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Error searching products' })
    }
}

export const soldOut = async(req, res) => {
    try {
        let stock = 0
        let products = await Product.find({ stock: stock })
        return res.send(products)
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error displaying sold out products' })
    }
}