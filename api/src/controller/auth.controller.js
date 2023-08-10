const mssql = require('mssql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { registrationSchema, loginSchema } = require('../utils/validator')
const { sqlConfig } = require('../config/database.connection.config')
const { hashPassword } = require('../utils/hash')
const { createToken } = require('../utils/token.gen')



module.exports.employeeRegister= async(req, res)=>{
    try {
        
        if(!req.body){
            return res.status(400).json({error: 'The request body can not be empty'})
        }
        const { firstName, lastName, email, password } = req.body
        const { error } = registrationSchema.validate({ firstName, lastName, email, password })
        if(error){
            return res.status(400).json({error: error.message})
        }else{
           // check if email is registred
           const pool = await mssql.connect(sqlConfig)
           const checkEmailQuery = await pool
           .request()
           .input('email', email)
           .execute('fetchUserByEmailPROC')

           if(checkEmailQuery.rowsAffected[0] == 1){
            return res.status(400).json({error: 'Account creation failed! This email is already registered'})
           }

           const hashedPwd = await hashPassword(password)
           
           await pool.request()
           .input('first_name', firstName)
           .input('last_name', lastName)
           .input('email', email)
           .input('password', hashedPwd)
            .execute('createNewUserPROC');
            
            const token = jwt.sign({email, is_admin: 0}, process.env.SECRET_KEY, {
                expiresIn: 24*60*60
            })

            res.status(201).json({message: 'Account created successfully', token, user: {firstName, lastName, email, is_admin: 0}})
        }   
    }   
    catch(error){
        return res.status(500).json({error: error.message})
    }
}


module.exports.login = async(req, res)=>{
    try {
        
        if(!req.body){
            return res.status(400).json({message: 'The request body can not be empty'})
        }
        const {email, password} = req.body
        const {error} = loginSchema.validate({email, password})
        if(error){
            return res.status(422).json({error: error.message})
        }
            // check if email is registered
    
            const pool = await mssql.connect(sqlConfig)
    
            const checkEmailQuery = await pool
            .request()
            .input('email', email)
            .execute('fetchUserByEmailPROC')
    
    
            if(checkEmailQuery.rowsAffected[0] == 0){
                return res.status(400).json({error: 'This email is not registred'})
            }else{
                const valid = await bcrypt.compare(password, checkEmailQuery.recordset[0].password)
                if(valid){
                    const token = jwt.sign({email: checkEmailQuery.recordset[0].email, is_admin: checkEmailQuery.recordset[0].password}, process.env.SECRET_KEY, {
                        expiresIn: 24*60*60
                    })
                    const {password, is_verified, is_assigned, ...user} = checkEmailQuery.recordset[0]
                    return res.status(200).json({message: 'Login successful', token, user})
                }else{
                    return res.status(400).json({error: 'Invalid login credentials'})
                }
            }
        
    } catch (error) {
        return res.status(500).json({error: `Internal server error, ${error.message}`})   
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

