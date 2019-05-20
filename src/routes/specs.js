var swagger = require("swagger-node-restify");
var errors = swagger.errors;
var paramTypes = swagger.params;

/**
 * Swagger specs for authenticate API
 *
 * @returns {{}}
 */
exports.specs = function () {

    var configuration = {};

    configuration.status = [];

    /**
     * Authenticate Spec
     * @type {{description: string, path: string, notes: string, summary: string, method: string, params: *[], type: string, errorResponses: *[], nickname: string}}
     */
    configuration.specAuthenticate = {
        description: 'Operation for authenticate a JWT through the IS',
        path: '/authenticate',
        notes: 'Executes authenticate service',
        summary: 'Returns a IS JWT',
        method: 'POST',
        consumes: ['application/x-www-form-urlencoded'],
        produces: ['application/json'],
        parameters: [
            paramTypes.header('oauth_consumer_key', 'OAuth Consumer Key', 'string', true),
            paramTypes.header('oauth_consumer_secret', 'OAuth Consumer Secret', 'string', true),
            paramTypes.form('username', 'The user name', 'string'),
            paramTypes.form('password', 'The user password', 'string')
        ],
        type: 'String',
        errorResponses: [
            swagger.errors.invalid('oauth_consumer_key'),
            errors.invalid('oauth_consumer_secret'),
            errors.invalid('username'),
            errors.invalid('password'),
            errors.notFound('authenticate')
        ],
        nickname: 'authenticate'
    };

    /**
     * Validate Spec
     * @type {{description: string, path: string, notes: string, summary: string, method: string, type: string, errorResponses: *[], nickname: string}}
     */
    configuration.specValidate = {
        description: 'Operation to validate an OAuth Access Token through the IS',
        path: '/validate',
        notes: 'Validates a given OAuth Access Token',
        summary: 'Returns if its an OAuth Access Token',
        method: 'POST',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
            paramTypes.body('payload', 'The OAuth Access Token to validate', 'object', JSON.stringify({"token": ""}))
        ],
        type: 'String',
        errorResponses: [
            errors.invalid('token'),
            errors.notFound('validate')
        ],
        nickname: 'validate'
    };

    /**
     * Revoke Spec
     * @type {{description: string, path: string, notes: string, summary: string, method: string, type: string, errorResponses: *[], nickname: string}}
     */
    configuration.specRevoke = {
        description: 'Operation to revoke OAuth Access Token through the IS',
        path: '/revoke',
        notes: 'Revokes a given OAuth Access Token',
        summary: 'Revokes the OAuth Access Token',
        method: 'POST',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
            paramTypes.header('oauth_consumer_key', 'OAuth Consumer Key', 'string', true),
            paramTypes.header('oauth_consumer_secret', 'OAuth Consumer Secret', 'string', true),
            paramTypes.body('payload', 'The OAuth Access Token to revoke', 'object', JSON.stringify({token: ""}))
        ],
        type: 'String',
        errorResponses: [
            errors.invalid('oauth_consumer_key'),
            errors.invalid('oauth_consumer_secret'),
            errors.invalid('token'),
            errors.notFound('revoke')],
        nickname: 'revoke'
    };

    return configuration;
};