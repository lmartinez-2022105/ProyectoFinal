import ShopCar from './shopCar.model.js'
import Product from '../product/product.model.js'
import mongoose from 'mongoose'

export const testShopCar = async()=>{
    try {
        return res.send({message: 'testShopCar'})
    } catch (error) {
        console.error(error)
        return error
    }
}

export const createCart = async (id) => {
    try {
        // Verificar si el usuario ya tiene un carrito de compras
        const existingCart = await ShopCar.findOne({ user: id });
        // Si el usuario ya tiene un carrito, no es necesario crear uno nuevo
        if (existingCart) {
            console.log('You already have a shopping cart')
            return existingCart;
        }
        // Crear un nuevo carrito para el usuario
        const newCart = new ShopCar({
            user: id,
            products: [],
            subtotal: 0
        })
        // Guardar el nuevo carrito en la base de datos
        await newCart.save();
        console.log('Shopping cart successfully created')
        return newCart;
    } catch (error) {
        console.error(error)
        throw new Error('Error creating shopping cart')
    }
}


export const addToCart = async (req, res) => {
    try {
        let {product, quantity} = req.body
        let {_id} = req.user
        let price = await Product.findOne({_id:product})
        let total = quantity * price.price
        // Buscar el carrito de compras del usuario
        let cart = await ShopCar.findOne({ user: _id })
        // Si el usuario no tiene un carrito de compras, crear uno nuevo
        if (!cart) {
            cart = await createCart(_id);
        }
        // Agregar el producto al carrito
        cart.products.push({
            product: product,
            quantity: quantity,
            price: price.price,
            total: total
        })
        // Calcular el subtotal del carrito
        cart.subtotal = cart.products.reduce((subtotal, product) => {
            return subtotal + product.total
        }, 0)
        cart.subtotal = parseFloat(cart.subtotal.toFixed(2));
        // Guardar los cambios en el carrito
        await cart.save();
        return res.send({message: 'Product added to cart successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error adding products to cart'})
    }
}

export const clearCart = async (userId) => {
    try {
        // Buscar el carrito de compras del usuario
        const cart = await ShopCar.findOne({ user: userId })
        // Si el usuario no tiene un carrito de compras, no hay nada que limpiar
        if (!cart) {
            console.log('You do not have a shopping cart.')
            return;
        }
        // Limpiar el carrito de compras
        cart.products = []
        cart.subtotal = 0
        // Guardar los cambios en el carrito
        await cart.save()
    } catch (error) {
        console.error(error)
        throw new Error(
            'Error clearing shopping cart')
    }
}

export const remove = async(req, res)=>{
    try {
        //Obtener el id del producto
        let {id} = req.params
        //Obtener el id del usuario
        let {_id} = req.user
        //Buscar el producto
        let producto = await Product.findOne({_id: id})
        console.log(producto)
        //Verificar si el usuario tenga carrito
        let cart = await ShopCar.findOne({user:_id})
        if(!cart) return res.status(404).send({ message: 'You do not have a shopping cart.'})
        //Buscar el indice del producto
        let ObjectId =  mongoose.Types.ObjectId;
        let productIndex = cart.products.findIndex(product => product.product.equals(new ObjectId(id)));
        if(productIndex === -1) return res.status(404).send({ message: 'Product not found in shopping cart'})
        //Eliminar el producto
        cart.products.splice(productIndex, 1)
        //Recalcular el subtotal
        cart.subtotal = cart.products.reduce((subtotal, product)=>{
            return subtotal + product.total
        },0)
        //Guardar cambios
        await cart.save()
        return res.send({ message: 'Product removed from cart successfully'})
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error removing product from cart' })
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let { quantity } = req.body
        let { _id } = req.user
        // Buscar el carrito de compras del usuario
        let cart = await ShopCar.findOne({ user: _id })
        // Si el usuario no tiene un carrito de compras, enviar un mensaje de error
        if (!cart) {
            return res.status(404).send({ message: 'You do not have a shopping cart.' })
        }
        // Encontrar el índice del producto en el carrito
        let ObjectId =  mongoose.Types.ObjectId;
        let productIndex = cart.products.findIndex(product => product.product.equals(new ObjectId(id)));
        console.log(productIndex)
        // Si el producto no está en el carrito, enviar un mensaje de error
        if (productIndex === -1) {
            return res.status(404).send({ message: 'Product not found in shopping cart' })
        }
        // Actualizar la cantidad del producto
        cart.products[productIndex].quantity = quantity
        cart.products[productIndex].total = quantity * cart.products[productIndex].price
        // Recalcular el subtotal del carrito
        cart.subtotal = cart.products.reduce((subtotal, product) => subtotal + product.total, 0)
        // Guardar los cambios en el carrito
        await cart.save()
        return res.send({ message: 'Product quantity updated successfully', cart })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating product quantity in cart' })
    }
}

export const view = async(req, res)=>{
    try {
        let {_id} = req.user
        let cart = await ShopCar.findOne({user: _id})
        return res.send({message:'Your Shopping Cart', cart})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error showing your shopping cart'})
    }
}
