const logger = require('../config/winston.config')

module.exports.errorLogger = (err, req, res, next)=>{
    if(err){
        console.log(`Error: ${err.message}`)
        return res.status(500).json({error: `Internal server error: ${err.message}`})
    }
    next()
}