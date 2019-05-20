/**
 * API Host
 * @type {string}
 */
exports.host = '0.0.0.0';
/**
 * API Port
 * @type {string}
 */
exports.port = 3000;
/**
 * IS Host
 * @type {string}
 */
exports.ISHost = 'https://sr-idp-xp01.corp.cablevision.com.ar';
/**
 * IS Port
 * @type {number}
 */
exports.isPort = 9443;
/**
 * Swagger API Info
 * @type {{title: string, description: string, contact: string, contactName: string, contactUrl: string, license: string, licenseUrl: string, termsOfService: string, version: string}}
 */
exports.swaggerApiInfo = {
    title: " Cablevision Authentication Module API",
    description: "This is the authentication API for Cablevision.",
    contact: "lcampana@cablevision.com.ar",
    contactName: "API Support",
    contactUrl: "https://www.cablevisionfibertel.com.ar/",
    license: "Apache 2.0",
    licenseUrl: "http://www.apache.org/licenses/LICENSE-2.0.html",
    termsOfService: "http://swagger.io/terms/",
    version: "1.0.0"
};
/**
 * Swagger authorizations
 * @type {{apiKey: {type: string, passAs: string}}}
 */
exports.swaggerAuthorizations = {
    apiKey: {
        type: "apiKey",
        passAs: "header"
    }
};
/**
 * HTTP requests configs
 * @type {{timeout: number}}
 */
exports.requests = {
    timeout: 5000
};
/**
 * OAuth Authentication revoke config
 * @type {{path: string, Token_type_hint: string}}
 */
exports.oAuthRevokeToken = {
    path: '/oauth2/revoke',
    'Token_type_hint': 'access_token'
};
/**
 * OAuth Authentication request config
 * @type {{path: string, timeout: number}}
 */
exports.oAuthRequestToken = {
    path: '/oauth2/token',
    grant_type: 'password'
};
/**
 * SOAP JWT request config
 * @type {{path: RegExp, OAuth2TokenValidationService: *}}
 */
exports.soapJWTValidate = {
    path: '/services/OAuth2TokenValidationService?wsdl',
    method: 'validate',
    wsdlFile: '../wsdl/OAuth2TokenValidationService.wsdl',
    user: 'admin',
    pass: 'admin',
    tokenType: 'bearer',
    requiredClaimURIs: [
        'http://wso2.org/claims/givenname',
        'http://wso2.org/claims/lastname',
        'http://wso2.org/claims/emailaddress',
        'http://wso2.org/claims/role'
    ],
    resultObject: ['validateResponse', 'return'],
    errorObject: ['validateResponse', 'return', 'errorMsg'],
    timeout: 5000
};
