const config = require('config');
const winston = require('winston');
const { format, transports } = winston;
const { combine, timestamp, prettyPrint } = format;
require('express-async-errors');

module.exports = function() {
    process.on('uncaughtRejection', (ex) => {
        throw ex;
    });
    
    winston.configure({
        format: combine(
            timestamp(),
            prettyPrint()
        ),
        transports: [
            new transports.File({
                filename: './logs/error.log',
                level: 'error'
            }),
            new transports.File({
                filename: './logs/combined.log',
                level: 'info'
            })
        ]
    })

    winston.exceptions.handle(
        new transports.File({
            filename: './logs/exception.log'
        })
    );

    if (config.get('app.env') !== 'production'){
        winston.add(
            new transports.Console({
                format: prettyPrint()
            })
        );
    }
}