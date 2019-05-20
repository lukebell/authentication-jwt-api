/**
 * Authentication Error
 *
 * @param code
 * @param msg
 * @constructor
 */
function AuthenticationError(code, msg) {

    Error.call(this);

    /**
     * the error code
     *
     * @type {Number}
     */
    this.code = code;

    /**
     * the error message
     *
     * @type {String}
     */
    this.msg = msg;

    // Error.captureStackTrace(this, AuthenticationError);

}

AuthenticationError.prototype = Object.create(Error.prototype);
AuthenticationError.prototype.constructor = AuthenticationError;
AuthenticationError.prototype.name = "AuthenticationError";

module.exports = AuthenticationError;
