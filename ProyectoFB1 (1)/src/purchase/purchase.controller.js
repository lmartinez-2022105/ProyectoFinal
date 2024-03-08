import Purchase from './purchase.model.js'
import ShopCar from '../shopCar/shopCar.model.js'
import Product from '../product/product.model.js'
import PDFDocument from 'pdfkit';
import User from '../user/user.model.js'
import fs from 'fs';
import { clearCart } from '../shopCar/shopCar.controller.js'

export const addPurchase = async (req, res) => {
    try {
        let { _id } = req.user // Obtener el ID del usuario
        let cart = await ShopCar.findOne({ user: _id }).populate('products.product')
        /* let product = await Product.find({id: cart.products.product})
        if(cart.products.products.quantity > product.stock){
            return res.status(404).send({message: ''})
        } */
        if(!cart) {
            return res.status(404).send({ message: 'Shopping cart not found' })
        }
        let purchaseItems = cart.products.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            price: item.product.price, // Usar el precio del producto del carrito
            subtotal: item.total
        }))
        let total = cart.subtotal // El total de la compra es igual al subtotal del carrito
        let {paymentMethod} = req.body // Obtener el método de pago desde el cuerpo de la solicitud
        let date = new Date() // Obtener la fecha y hora actual
        // Crear la compra
        const purchase = new Purchase({
            user: _id,
            product: purchaseItems,
            total: total,
            paymentMethod: paymentMethod,
            date: date
        })
        // Guardar la compra en la base de datos
        await purchase.save()
        // Actualizar el stock y el sellCount de los productos en el carrito
        for (let item of cart.products) {
            let product = await Product.findById(item.product._id) // Encontrar el producto por su ID
            if (!product) {
                console.log(`Product with ID ${item.product._id} not found.`)
                continue
            }
            product.stock -= item.quantity // Restar la cantidad del producto del stock
            product.sellCount += item.quantity // Aumentar el contador de ventas del producto
            await product.save() // Guardar los cambios en el modelo del producto
        }
        // Limpiar el carrito
        await clearCart(_id)
        return res.send({ message: 'Purchase completed successfully', purchase })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error completing purchase' })
    }
}

export const purchaseHistorial = async(req,res)=>{
    try {
        let {_id} = req.user
        let allPurchases = await Purchase.find({user: _id}).populate('product',['name'])
        return res.send({message:'Purchases Historial', allPurchases})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error displaying purchase historial' })
    }
}




export const createAndDowload = async (req, res) => {
    try {
        const { id } = req.params
        let {_id} = req.user
        // Obtener detalles de la compra
        const user = await User.findOne({_id:_id})
        const purchase = await Purchase.findOne({_id: id}).populate('product.productId')
        console.log(purchase)
        // Calcular el total de la factura
        const total = purchase.total
        // Crear un nuevo documento PDF
        const doc = new PDFDocument()
        // Escribir contenido en el PDF
        doc.text('Factura de Compra\n\n')
        doc.text(`Fecha: ${new Date(purchase.date).toLocaleDateString()}\n\n`)
        doc.text(`Name: ${user.name}\n\n`)
        doc.text(`Surname: ${user.surname}\n\n`)
        doc.text(`Address: ${user.address} Contry: ${user.country}\n\n`)
        doc.text(`NIT: ${user.NIT}\n\n`)
        doc.text('Detalles de la Compra:\n\n')
        doc.text('_________________________________\n\n')
        // Agregar detalles de los productos comprados
        purchase.product.forEach(item => {
            doc.text(`Producto: ${item.productId.name}\n`)
            doc.text(`Cantidad: ${item.quantity}\n`);
            doc.text(`Precio unitario: $${item.price}\n`)
            doc.text(`Subtotal: $${item.subtotal}\n\n`)
        });
        // Escribir el total de la factura
        doc.text(`Total: $${total}`)
        // Finalizar el documento
        doc.end();
        // Guardar el PDF en el sistema de archivos
        const filePath = `invoices/factura_${id}.pdf`; // Nombre del archivo basado en el ID de la compra
        doc.pipe(fs.createWriteStream(filePath))
        // Enviar el PDF como respuesta a la solicitud HTTP
        doc.pipe(res)
        // Descargar el PDF en el navegador
        res.setHeader('Content-Disposition', `attachment; filename="factura_${id}.pdf"`)
        // Indicar el tipo de contenido
        res.setHeader('Content-Type', 'application/pdf')
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error generating invoice' })
    }
}
