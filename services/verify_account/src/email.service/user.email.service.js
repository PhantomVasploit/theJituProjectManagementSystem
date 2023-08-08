const ejs = require('ejs')
const mssql = require('mssql')
const { sqlConfig } = require('../config/database.connection.config')
const { sendMail } = require('../utils/email.utils')


module.exports.welcomeEmail = ()=>{
    mssql.connect(sqlConfig)
    .then((pool)=>{
        pool.request()
        .query(`SELECT email FROM usersTable WHERE is_verified = 0`)
        .then((result)=>{
            for(user of result.recordset){
                ejs.renderFile('./src/templates/verifyUser.ejs'
                , {email: user.email}, async(error, html)=>{
                    const message = {
                        from: process.env.email,
                        to: user.email,
                        subject: 'Account verification',
                        html
                    }
                    try {
                        await sendMail(message)
                        await pool.request()
                        .query(`UPDATE usersTable SET is_verified=1 WHERE email = '${user.email}'`)
                    } catch (error) {
                        console.log(error.message);                    
                    }
                })
            }
        })
        .catch((e)=>{
            console.log(e.message);
        })
    })
    .catch((e)=>{
        console.log(e.message);
    })
}