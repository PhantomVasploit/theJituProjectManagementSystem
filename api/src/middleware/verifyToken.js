const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization_token'];
        if (!token) {
            return res.status(401).json({ error: 'Access denied' });
        } else {
            const decoded_token = await jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded_token;
            next();
    }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    verifyToken
}