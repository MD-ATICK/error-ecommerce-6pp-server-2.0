require('dotenv').config()
const mongoose = require('mongoose')

exports.databaseConnect = async () =>{
    try {
        await mongoose.connect(process.env.MongoUrl)
        console.log('connect'); 
    } catch (error) {
        console.log('not connect');
    }
}