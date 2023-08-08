const nodemailer = require('nodemailer')
const { emailConfig } = require('../config/email.config')



function createTranspoter(config){
    return nodemailer.createTransport(config)
}

module.exports.sendMail = async(messageOptions)=>{
    try {
        let transporter = createTranspoter(emailConfig)
        await transporter.verify()
        await transporter.sendMail(messageOptions, (err, info)=>{
        console.log(info);
    })   
    } catch (error) {
        console.log(error.message);
    }
}