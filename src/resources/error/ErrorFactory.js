/**
 * Defined Authentication Service Errors
 */
var AuthenticationError = require('./AuthenticationError');

/**
 * @returns {*} Error containing data that describes the error
 */
exports.tokenInvalid = function () {
    return new AuthenticationError(401, 'This token is invalid');
};

/**
 * @param parameter
 * @returns {*} Error containing data that describes the error
 */
exports.parameterRequired = function (parameter) {
    return new AuthenticationError(401, 'Parameter required: ' + parameter);
};

/**
 * @param message
 * @returns {*} Error containing data that describes the error
 */
exports.requestErrorMessage = function (message) {
    return new AuthenticationError(401, message);
};

/**
 * @param message
 * @returns {*} Error containing data that describes the error
 */
exports.internalError = function (message) {
    return new AuthenticationError(500, message);
};
