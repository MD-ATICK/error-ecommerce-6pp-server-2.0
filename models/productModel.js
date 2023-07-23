
const mongoose = require('mongoose')

const productshema = mongoose.Schema({
    productname : {
        type : String ,
        required : [true , 'Please enter product name'] ,
        trim : true
    },
    description : {
        type : String ,
        required : [true , 'Please enter product description'] ,
    },
    price : {
        type : Number ,
        required : [true , 'Please enter product price'] ,
        maxLength : [8 , 'price must be under 8 charecters']
    },
    ratings : {
        type : Number ,
        default : 0,
    },
    images : [{
        publicId : {
            type : String ,
        } ,
        url : {
            type : String ,
        } ,
    }] ,
    category : {
        type : String ,
        required : [true , 'required failed category'] , 
    } ,
    reviews : [
        {
            user : {
                type : mongoose.Schema.ObjectId ,
                ref : 'user' ,
                required : true
            } ,
            name : {
                type : String ,
                required : true ,
            } ,
            rating : {
                type : Number ,
                required : true
            } ,
            comment : {
                type : String ,
                required : true
            } ,
            image : {
                type : String ,
                required : true
            }
        }
    ] ,
    stock : {
        type : Number ,
        required : [true , 'required failed stock'] , 
        maxLength : [4 , 'stock must be under 4 charecters'] ,
        default : 1 ,
    } ,
    numOfReviews : {
        type : Number ,
        default : 0 ,
    } ,
    createTime : {
        type : String ,
        default : Date.now
    },
    user : {
        required : true ,
    } ,
})


const productModel = mongoose.model('products' , productshema)

module.exports = productModel 