
const mongoose = require('mongoose')
const crypto = require('crypto')

  
const userSchema = mongoose.Schema({
    name : {
        type : String ,
        // minLength : [ 4 , 'name must be gather then 4 charecters'] ,
        // maxLength : [ 30 , 'name must be less then 30 charecters'] ,
        // required  : [ true , 'Please enter your name' ] ,
        trim : true ,
    } ,
    email : {
        type : String ,
        unique : true ,
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        // required  : [ true , 'Please enter your name' ]
    } ,
    password : {
        type : String ,
        // minLength : [ 8 , 'password must be gather then 4 charecters'] ,
        // required  : [ true , 'Please enter your password' ]
    } ,
    avatar : {
        publicId : {
            type : String ,
            default: 'user'
            // required : true
        } ,
        url : {
            type : String ,
            // required  : [ true , 'Please enter your avater' ] ,
    } ,
    } ,
    role : {
        type : String ,
        default : 'user'
    },
    resetPasswordToken  : String ,
    resetPasswordExpire : Date ,
})

// Reset password
// userSchema.methods.getResetPasswordToken = () => {

//     const resetToken = crypto.randomBytes(20).toString('hex')

//     this.resetPasswordToken = crypto
//         .createHash('sha256')
//         .update(resetToken)
//         .digest('hex')

//     this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

//     return resetToken ;
// }



const userModel = mongoose.model('users' , userSchema)

module.exports = userModel ;
