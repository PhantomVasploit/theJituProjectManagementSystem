const mssql = require('mssql')
const { sqlConfig } = require('../config/database.connection.config')
const { updateSchema } = require('../utils/validator')


module.exports.getAllEmployees = (req, res)=>{
    mssql.connect(sqlConfig)
    .then((pool)=>{
        pool.request()
        .execute('fetchAllUser')
        .then((result)=>{
            const {password, is_admin, ...employees} = result.recordset[0]
            return res.status(200).json({employees})
        })
        .catch((e)=>{
            return res.status(500).json({error: e.message})
        })
    })
    .catch((e)=>{
        return res.status(500).json({error: e.message})
    })
}

module.exports.getEmployeeById = (req, res)=>{
    const {id} = req.params

    mssql.connect(sqlConfig)
    .then((pool)=>{
        pool.request()
        .input('id', id)
        .execute('fetchUserByIdPROC')
        .then((result)=>{
            const { password, is_admin, ...employee } = result.recordset[0]
            return res.status(200).json({message: 'Fetch successful', employee})
        })
        .catch((e)=>{
            return res.status(500).json({error: e.message})    
        })
    })
    .catch((e)=>{
        return res.status(500).json({error: e.message})
    })
}


module.exports.updateEmployeeAccount = (req, res)=>{
    const {id} = req.params
    const {firstName, lastName, email} = req.body
    const {error} = updateSchema.validate({firstName, lastName, email})

    if(error){
        return res.status(422).json({error: error.message})
    }else{
        mssql.connect(sqlConfig)
        .then((pool)=>{
            pool.request()
            .input('id', id)
            .execute('fetchUserByIdPROC')
            .then((result)=>{
                if(result.recordset.length <= 0){
                    return res.status(404).json({error: `User not found`})
                }else{
                    pool.request()
                    .input('id', id)
                    .input('first_name', firstName)
                    .input('last_name', lastName)
                    .input('email', email)
                    .execute('updateUserAccountPROC')
                    .then((update)=>{
                        return res.status(200).json({message: 'Update successful'})
                    })
                    .catch((e)=>{
                        return res.status(500).json({error: e.message})
                    })
                }
            })
            .catch((e)=>{
                return res.status(500).json({error: e.message})    
            })
        })
        .catch((e)=>{
            return res.status(500).json({error: e.message})
        })
    }
}


module.exports.deleteEmployeeAccount = (req, res)=>{
    const {id} = req.params
    mssql.connect(sqlConfig)
    .then((pool)=>{
        pool.request()
        .input('id', id)
        .execute('fetchUserByIdPROC')
        .then((result)=>{
            if(result.recordset.length <= 0){
                res.status(404).json({error: 'Account to delete not found'})
            }else{
                pool.request()
                .input('id', id)
                .execute('deleteUserAccount')
                .then((result)=>{
                    res.status(200).json({message: `Account deleted successfully`})
                })
                .catch((e)=>{
                    return res.status(500).json({error: e.message})        
                })
            }
        })
        .catch((e)=>{
            return res.status(500).json({error: e.message})    
        })
    })  
    .catch((e)=>{
        return res.status(500).json({error: e.message})
    }) 
}