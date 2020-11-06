const winston = require('winston')

const isProduction = process.env.NODE_ENV === 'production'

const loggers = []
const format = isProduction
    ? winston.format.json()
    : winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
    )

loggers.push(new winston.transports.Console({ format }))

const logger = winston.createLogger({
    defaultMeta: {
        service: 'BankinClient',
    },
    transports: loggers,
})

module.exports = logger
