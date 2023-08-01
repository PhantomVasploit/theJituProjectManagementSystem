module.exports.sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    databse: process.env.DB_NAME,
    server: 'localhost',
    pool:{
        max: 10,
        min: 0,
        idleTimeoutMillis: 3000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}