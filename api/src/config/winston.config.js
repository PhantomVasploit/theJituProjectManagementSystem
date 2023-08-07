const winston = require('winston')

const logger = winston.createLogger({
    level: 'verbose',
    format: winston.format.json(),
    defaultMeta: {service: 'The Jitu Project Management API server'},
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'})
    ]
})

module.exports = logger