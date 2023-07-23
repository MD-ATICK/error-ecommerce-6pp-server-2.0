require('dotenv').config()

const userModel = require("../models/userModel")
const bcrypt = require('bcrypt')
const saltRound = 10
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../utils/EmailSend')


// REGISTER route
exports.userRegister = async (req, res, next) => {
    try {
        const { name, email, password , avatar } = req.body
        console.log(req.body)

        const user = await userModel.findOne({email})
        if (user) {
            return res.send({ success: false, errMsg: 'user is already created' })
        }
        bcrypt.hash(password, saltRound, async (err, hash) => {
            const newUser = await userModel({
                name,
                email,
                password: hash,
                avatar: {
                    publicId: 'img found',
                    url: avatar
                }
            })
            const saveUser = await newUser.save()

            // token
            const payload = {
                id: saveUser._id,
                name: saveUser.name
            }

            res.send({
                success: true,
                user: saveUser,
            })
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
}


// LOGIN route
exports.userLogin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const user = await userModel.findOne({ email })
        // console.log(user);
        if (!user) {
            return res.send({ success: false, msg: 'login failed user not found !!' })
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.send({
                success: false,
                msg: "password is incorrect"
            })
        }

        const payload = {
            id: user._id,
            name: user.name
        }
        const token = jwt.sign(payload, process.env.TokenSecretKEY, { expiresIn: process.env.ExpiredToken })

        const options = {
            expires: new Date(Date.now() + 2 * 24 * 60 * 600 * 1000),
            httpOnly: true,
        }

        res.status(200).cookie("token", token, options).json({
            success: true,
            token,
            user,
        })

    } catch (error) {
        res.send('error')
    }
}


// LOGOUT route
exports.userLogout = async (req, res) => {

    const options = {
        expires: new Date(Date.now()),
        httpOnly: true
    }

    res.cookie("token", null, options).send({
        success: true,
        message: 'logout succesfully'
    })


}


// PROFILE Get Route
exports.ProfileMe = (req, res) => {
    res.send({
        success: true,
        user: req.user._id,
        Profile: req.user,
    })
}


// FORGET PASSWORD Route
exports.forgetPassword = async (req, res) => {

    let user = await userModel.findOne({ email: req.body.email })

    if (!user) {
        return res.send('login failed. Enter email is incorrect !')
    }

    const resetToken = crypto.randomBytes(20).toString('hex')

    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${req.get("post")}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email then , you can ignore it `

    // try {

    //   await sendEmail({
    //         email : user.email ,
    //         subject : `E-commerce Password Recovery` ,
    //         message ,
    //     })
    //     // console.log(x);

    //   return res.json({
    //         msg : `Email sent to ${user.email} successfully`
    //     })
    // } catch (error) {
    //     user.resetPasswordExpire = undefined ;
    //     user.resetPasswordToken = undefined ;
    //     await user.save({validateBeforeSave : false})
    //    return res.json({
    //         msg : `Email sent to ${user.email} Failed` 
    //     })
    // }

}


// CHANGE Password Route
exports.ChangePassword = async (req, res) => {

    const id = req.user._id

    const user = await userModel.findById(id)
    if (!bcrypt.compareSync(req.body.oldpassword, user.password)) {
        return res.send({ success: false, msg: 'Enter your correct Old password !!' })
    }

    if (req.body.newpassword !== req.body.comfirmpassword) {
        return res.send({ success: false, msg: 'password does not match !!' })
    }

    bcrypt.hash(req.body.newpassword, 10, async (err, hash) => {

        user.password = hash

        await user.save({ validateBeforeSave: false })

        res.send({ success: true, UpdatedUser: user })
    })

}


// PROFILE NAME And EMAIL Change 
exports.profileChange = async (req, res) => {

    const id = req.user._id

    const { email } = req.body

    const userMatch = await userModel.findOne({ email })
    if (userMatch) {
        return res.send({ success: false, errMsg: 'Ops sry ,User have been Created', user: userMatch })
    }
    const updateProfile = {
        name: req.body.name,
        email: req.body.email,
        avatar : {
            url : req.body.avatar
        }
    }

    // let user2 = await userModel.findById(id)
    // user2.avatar.url = req.body.avater
    // await user2.save();
    const user = await userModel.findByIdAndUpdate(id, updateProfile, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    res.status(200).send({
        success: true,
        changeProfile: user
    })

}


// GET all user -> admin
exports.allUsers = async (req, res) => {

    const users = await userModel.find()

    res.status(200).send({
        sucess: true,
        userNo: users.length,
        users,
    })

}


// get user -> admin
exports.GetUser = async (req, res) => {

    const id = req.params.id

    const user = await userModel.findById(id)

    if (!user) {
        return res.status(200).send({ msg: `user not found of ${id}` })
    }

    res.status(200).send({
        success: true,
        user,
    })

}


// set User role -> admin
exports.updateUserRole = async (req, res) => {

    const id = req.params.id

    const updateProfile = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await userModel.findByIdAndUpdate(id, updateProfile, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).send({ changeProfile: user })

}


// delete user -> admin
exports.deleteUser = async (req, res) => {

    const id = req.params.id

    const user = await userModel.findById(id)

    if (!user) {
       return res.send({ msg: `user does not exist with this ${id}` })
    }

    const dltuser = await userModel.findByIdAndDelete(id)

    res.send({ 
        success : true ,
        dltuser ,
    })

}


