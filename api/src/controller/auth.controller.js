const mssql = require('mssql')
const bcrypt = require('bcrypt')

const { registrationSchema, loginSchema } = require('../utils/validator')
const { sqlConfig } = require('../config/database.connection.config')
const { hashPassword } = require('../utils/hash')
const { createToken } = require('../utils/token.gen')

module.exports.employeeRegister=(req, res)=>{
    const { firstName, lastName, email, password } = req.body
    const { error } = registrationSchema.validate({ firstName, lastName, email, password })
    if(error){
        return res.status(400).json({error: error.message})
    }else{
       // check if email is registred
       mssql.connect(sqlConfig)
       .then((pool)=>{
            pool.request()
            .input('email', email)
            .execute('fetchUserByEmailPROC')
            .then((result)=>{
                if(result.recordset.length > 0){
                    return res.status(400).json({error: 'Account creation failed! This email is already registered'})
                }else{
                    hashPassword(password)
                    .then((hashedPwd)=>{
                        pool.request()
                        .input('first_name', firstName)
                        .input('last_name', lastName)
                        .input('email', email)
                        .input('password', hashedPwd)
                        .execute('createNewUserPROC')
                        .then((result)=>{
                            const token = createToken({email, is_admin: 0})
                            return res.status(201).json({message: 'Account created successfully', token})
                        })
                        .catch((e)=>{
                            return res.status(500).json({error: `Internal server error, ${e.message}`})
                        })
                    })
                    .catch((e)=>{
                        return res.status(500).json({error: `Internal server error, ${e.message}`})
                    })
                }
            })
            .catch((e)=>{
                return res.status(500).json({error: `Internal server error, ${e.message}`})
            })
       })
       .catch((e)=>{
        return res.status(500).json({error: `Internal server error, ${e}`})
       })
    }   
}


module.exports.employeeLogin = (req, res)=>{
    const {email, password} = req.body
    const {error} = loginSchema.validate({email, password})
    if(error){
        return res.status(422).json({error: error.message})
    }else{
        // check if email is registered
        mssql.connect(sqlConfig)
        .then((pool)=>{
            pool.request()
            .input('email', email)
            .execute('fetchUserByEmailPROC')
            .then((result)=>{
                if(result.recordset <= 0){
                    return res.status(400).json({error: 'This email is not registred'})
                }else{
                    bcrypt.compare(password, result.recordset[0].password)
                    .then((valid)=>{
                        if(valid){
                            const token = createToken({email, is_admin: result.recordset[0].is_admin})
                            const {password, is_verified, is_assigned, ...user} = result.recordset[0]
                            return res.status(200).json({message: 'Login successful', token, user})
                        }else{
                            return res.status(400).json({error: 'Invalid login credentials'})
                        }
                    })
                    .catch((e)=>{
                        return res.status(500).json({error: `Internal server error, ${e.message}`})        
                    })
                }
            })
            .catch((e)=>{
                return res.status(500).json({error: `Internal server error, ${e.message}`})    
            })
        })
        .catch((e)=>{
            return res.status(500).json({error: `Internal server error, ${e.message}`})
        })
    }
}


module.exports.adminLogin = (req, res)=>{
    const {email, password} = req.body
    const {error} = loginSchema.validate({email, password})
    if(error){
        return res.status(400).json({error: error.message})
    }else{
        // check if email is registered
        mssql.connect(sqlConfig)
        .then((pool)=>{
            pool.request()
            .input('email', email)
            .execute('loginAdmin')
            .then((result)=>{
                if(result.recordset <= 0){
                    return res.status(400).json({error: 'This email is not registred'})
                }else{
                    bcrypt.compare(password, result.recordset[0].password)
                    .then((valid)=>{
                        if(valid){
                            const token = createToken({email, is_admin: result.recordset[0].is_admin})
                            const {password, is_verified, is_assigned, ...user} = result.recordset[0]
                            return res.status(200).json({message: 'Login successful', token, user})
                        }else{
                            return res.status(400).json({error: 'Invalid login credentials'})
                        }
                    })
                    .catch((e)=>{
                        return res.status(500).json({error: `Internal server error, ${e.message}`})        
                    })
                }
            })
            .catch((e)=>{
                return res.status(500).json({error: `Internal server error, ${e.message}`})    
            })
        })
        .catch((e)=>{
            return res.status(500).json({error: `Internal server error, ${e.message}`})
        })
    }
}


module.exports.adminRegister = (req, res)=>{
    const { firstName, lastName, email, password } = req.body
    const { error } = registrationSchema.validate({ firstName, lastName, email, password })
    if(error){
        return res.status(400).json({error: error.message})
    }else{
       // check if email is registred
       mssql.connect(sqlConfig)
       .then((pool)=>{
            pool.request()
            .input('email', email)
            .execute('fetchUserByEmailPROC')
            .then((result)=>{
                if(result.recordset.length > 0){
                    return res.status(400).json({error: 'Account creation failed! This email is already registered'})
                }else{
                    hashPassword(password)
                    .then((hashedPwd)=>{
                        pool.request()
                        .input('first_name', firstName)
                        .input('last_name', lastName)
                        .input('email', email)
                        .input('password', hashedPwd)
                        .execute('createNewAdminPROC')
                        .then((result)=>{
                            const token = createToken({email, is_admin: 1})
                            return res.status(201).json({message: 'Account created successfully', token})
                        })
                        .catch((e)=>{
                            return res.status(500).json({error: `Internal server error, ${e.message}`})
                        })
                    })
                    .catch((e)=>{
                        return res.status(500).json({error: `Internal server error, ${e.message}`})
                    })
                }
            })
            .catch((e)=>{
                return res.status(500).json({error: `Internal server error, ${e.message}`})
            })
       })
       .catch((e)=>{
        return res.status(500).json({error: `Internal server error, ${e}`})
       })
    }
}

