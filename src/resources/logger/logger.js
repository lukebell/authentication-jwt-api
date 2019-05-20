var Logger = require('bunyan');
var restify = require('restify');

var log = Logger.createLogger(
    {
        name: 'authentication-jwt-api',
        src: true,
        streams: [
            {
                stream: process.stdout,
                level: 'debug'
            },
            {
                type: 'rotating-file',
                path: './logs/authentication-jwt-api.log',
                level: 'info',
                period: '1d',   // daily rotation
                count: 7        // keep 7 back copies
            },
            {
                type: 'rotating-file',
                path: './logs/authentication-jwt-api-error.log',
                level: 'error',
                period: '1d',   // daily rotation
                count: 7        // keep 7 back copies
            }
        ],
        serializers: restify.bunyan.serializers

    });

Logger = function () {
};

Logger.prototype = {
    getSystemLogger: function () {
        return log;
    }
};

module.exports = Logger;