const orderModel = require("../models/orderModel")
const productModel = require("../models/productModel")




// CREATE new order order
exports.createOrder = async (req , res) => {
    const { shippingInfo , 
            orderItems , 
            paymentInfo , 
            itemsPrice , 
            taxPrice , 
            shippingPrice , 
            totalPrice  } = req.body

     const newCreate = new orderModel({
        shippingInfo , 
        orderItems , 
        paymentInfo , 
        itemsPrice , 
        taxPrice , 
        shippingPrice , 
        totalPrice ,
        paidAt : Date.now() ,
        users : req.user._id ,
 })      
     

     const saveuser = await newCreate.save()

     res.status(201).send({
        success : true ,
        Order : saveuser ,
     })
}


// GET single order
exports.getSingleOrder = async (req , res) => {
    
    const order = await orderModel.findById(req.params.id).populate("users" , "name email")

    
    if (!order) {
        return res.send(`order of ${req.params.id} not found`)
    }
    
    if (order.users._id !== req.user._id) {
       return res.status(200).send({
            success : true ,
            order ,
        }) 
    }


}


// my orders or users order
exports.myOrders = async (req , res) => {
    
    const orders = await orderModel.find({users : req.user._id})

    res.status(200).send({
        success : true ,
        length : orders.length ,
        orders ,
    })

}


// Admin Get all order
exports.allOrder = async (req , res) => {
    
    const orders = await orderModel.find()
    let totalamount = 0

    orders.forEach((order) => {
        totalamount += order.totalPrice
    })

    res.send({
        success : true ,
        length : orders.length ,
        totalamount ,
        orders ,
    })

}



// Update order Status
exports.UpdateOrderStatus = async (req , res) => {
    
    try {
        const order = await orderModel.findById(req.params.id)
        
        if (!order) {
            return res.send({msg : 'order not found for update'})
        }
        if (order.orderStatus === 'delivered') {
           return res.send("order already delivered , you can't do anything")
        }
        // order.orderItems.map(async (orderItems) => {
        //     await updateStock(orderItems.product , orderItems.quantity)
        // })
        order.orderStatus = req.body.orderStatus
        if (req.body.status ===  'delivered') {
            order.delieredAt = Date.now()
        }
        await order.save()
        res.status(200).send({
            success : true ,
            status : order.orderStatus ,
            order ,
        })
    } catch (error) {
        res.send(`order not found`)
    }
}


const updateStock = async (id , quantity) => {

    const product = await productModel.findById(id)

    product.stock -= quantity 

    await product.save()

}
// update order status end //


// delete order
exports.deleteOrder = async (req , res) => {
    try {
        const order = await orderModel.findById(req.params.id)
    
        if (!order) {
          return res.send({msg : 'order not found'})
        }
    
        res.send({
            success : true ,
            order ,
        })
    
        await orderModel.findByIdAndRemove(req.params.id)
        
    } catch (error) {
       res.send('order not found') 
    }

}
