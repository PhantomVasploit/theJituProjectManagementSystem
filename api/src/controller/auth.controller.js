const mssql = require('mssql')

const { registrationSchema } = require('../utils/validator')
const { sqlConfig } = require('../config/database.connection.config')
const { hashPassword } = require('../utils/hash')
const { createToken } = require('../utils/token.gen')

module.exports.employeeRegister=(req, res)=>{
    //sanitize request data
    const { error } = registrationSchema.validate(req.body)
    if(error){
        return res.status(400).json({error: error.message})
    }else{
        // check if employee email is already registered
        const {firstName, lastName, email, pasword} = req.body
        mssql.connect(sqlConfig)
        .then((pool)=>{
            pool.request()
            .input('email', email)
            .execute('getUserByEmailProc')
            .then((result)=>{
                if(result.recordset.length > 0){
                    return res.status(400).json({error: `Failed to created account. This Email is already registered`})
                }else{
                    hashPassword(pasword)
                    .then((hashedPwd)=>{
                        pool.request()
                        .input('first_name', firstName)
                        .input('last_name', lastName)
                        .input('email', email)
                        .input('password', hashedPwd)
                        .execute('createUserProc')
                        .then((result)=>{
                            const token = createToken({email})
                            return res.status(201).json({message: 'Employee account created successfully', token})
                        })
                        .catch((e)=>{
                            return res.status(500).json({error: `Internal server error: ${e.message}`})
                        })
                    })
                    .catch((e)=>{
                        return res.status(500).json({error: `Internal server error: ${e.message}`})
                    })
                }
            })
            .catch((e)=>{
                return res.status(500).json({error: `Internal server error: ${e.message}`})
            })
        })
        .catch((e)=>{
            return res.status(500).json({error: `Internal server error: ${e.message}`})
        })
    }
}