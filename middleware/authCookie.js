require('dotenv').config()
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

exports.isAuthenticateUser = async ( req , res , next ) => {
      
         const { token } = req.body
         console.log(req.body)
           if (!token) {
              return res.send('Please login to access this resource')
           }
           const { id } = jwt.verify(token , process.env.TokenSecretKEY)
           req.user = await userModel.findById(id)
           next()

}

exports.authorizeRoles = (...roles) => {
   return ( req , res , next) => {
        if (!roles.includes(req.user.role)) {
         return res.send({msg : `Role : ${req.user.role} is not allowd in this website`})
        }
        next()
   }
}
