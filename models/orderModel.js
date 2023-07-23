const mongoose = require('mongoose')


const orderShcema = mongoose.Schema({
 
    shippingInfo: {
            address: {
                type: String,
                required : [true , 'requied address just']
            },
            city: {
                type: String,
                required : [true , 'requied city just']
            },
            state: {
                type: String,
                required : [true , 'requied state just']
            },
            country: {
                type: String,
                required : [true , 'requied coun just']
            },
            pincode: {
                type: Number,
                required : [true , 'requied pin just']
            },
            phoneNo: {
                type: Number,
                required : [true , 'requied no just']
            }
        },
        
    orderItems: [
            {
                productname: {
                    type: String,
                    required : [true , 'requied productname just']  },
                price: {
                    type: String,
                    required : [true , 'requied price just'] },
                quantity: {
                    type: String,
                    required : [true , 'requied quantity just']
                },
                images:{
                    type : String ,
                    required : [true , 'one and only']
                },
                _id: {
                    type: mongoose.Schema.ObjectId,
                    ref : 'product' ,
                    // required : [true , 'requied images just']
                },
            }
        ] ,

    users: {
            type: mongoose.Schema.ObjectId,
            ref : "users" ,
            required : [true , 'requied user just']
        },

    paymentInfo : {
            id : {
                type : String ,
                default : 'sample id' ,
                required : true ,
            } ,
            status : {
                type : String ,
                default : 'successed' ,
                required : true ,
            } 
        } ,
            
    paidAt : {
            type : Date ,
            required : true ,
            } ,
    itemsPrice : {
            type : Number ,
            required : true ,
            default : 0 ,
            } ,
    taxPrice : {
                type : Number ,
                default : 0 ,
                required : true ,
            } ,
    shippingPrice : {
                type : Number ,
                default : 0 ,
                required : true ,
            } ,
    totalPrice : {
                type : Number ,
                default : 0 ,
                required : true ,
            },
    orderStatus : {
                type : String ,
                default : 'processing' ,
                required : true ,
            },
    createTime : {
                type : Date ,
                default : Date.now, 
            } ,
    delieredAt : Date ,
})


const orderModel = mongoose.model('order' , orderShcema)

module.exports = orderModel ;