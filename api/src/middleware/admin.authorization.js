const jwt = require('jsonwebtoken')

module.exports.adminAuthorization = (req, res, next)=>{
    try {
        
        const bearerHeader = req.headers['authorization']
        if(!bearerHeader){
            return res.status(401).json({error: 'Authentication headers not set'})
        }else{
            const bearer = bearerHeader.split(' ')
            const token = bearer[1]

            if(!token){
                return res.status(401).json({error: 'Authentication token not set'})
            }else{
                return jwt.verify(token, process.env.SECRET_KEY, (error, decodedToken)=>{
                    if(error){
                        return res.status(401).json({error: error.message})
                    }
                    if(decodedToken.is_admin == 1){
                        next()
                    }else{
                        return res.status(401).json({error: 'Restricted access'})
                    }
                })
            }
        }

    } catch (error) {
        return res.status(500).json({error: `Internal server error: ${error.message}`})       
    }
}