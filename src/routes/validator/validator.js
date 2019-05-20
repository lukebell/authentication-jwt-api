/**
 * Error factory
 * @type {Object}
 */
var errorFactory = require('../../resources/error/ErrorFactory');
var Logger = require('../../resources/logger/logger');
var log = new Logger().getSystemLogger();

/**
 * Validations for API resources
 * @type {{validate: exports.checkParams.validate, authenticate: exports.checkParams.authenticate, revoke: exports.checkParams.revoke}}
 */
var checkParams = {
    authenticate: function (consumerKey, consumerSecret, username, password) {
        return new Promise(function (resolve, reject) {
            checkParams.validateParameter(consumerKey, 'consumer key', reject);
            checkParams.validateParameter(consumerSecret, 'consumer secret', reject);
            checkParams.validateParameter(username, 'username', reject);
            checkParams.validateParameter(password, 'password', reject);
            return resolve();
        });
    },
    validate: function (token) {
        return new Promise(function (resolve, reject) {
            checkParams.validateParameter(token, 'token', reject);
            return resolve();
        });
    },
    revoke: function (consumerKey, consumerSecret, token) {
        return new Promise(function (resolve, reject) {
            checkParams.validateParameter(consumerKey, 'consumer key', reject);
            checkParams.validateParameter(consumerSecret, 'consumer secret', reject);
            checkParams.validateParameter(token, 'token', reject);
            return resolve();
        });
    },
    validateParameter: function (parameter, message, reject) {
        if (!parameter || parameter === null || parameter === '') {
            var error = errorFactory.parameterRequired(message);
            log.error(error);
            return reject(error);
        }
    }
};

module.exports = {
    checkParams: checkParams
};