
const nodeMailer = require('nodemailer')
require('dotenv').config()

const sendEmail = async (options) => {


    const transporter = nodeMailer.createTransport({
        service : SMPT_SERVICE ,
        // host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth : {
            user : process.env.SEND_EMAIL ,
            pass : process.env.EMAIL_PASSWORD ,
        }
    })
    
    // const mailOptions = 

     await transporter.sendMail({
        from : process.env.SEND_EMAIL ,
        to : options.email ,
        subject : options.subject ,
        text : options.message ,
    });

}

module.exports = sendEmail ;