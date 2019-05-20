/**
 * SOAP Generic Client Module
 */
var request = require('request');
var soap = require('soap');
var fs = require('fs');
var errorFactory = require('../error/ErrorFactory');
var Logger = require('../logger/logger');
var log = new Logger().getSystemLogger();

/**
 * Generates the wsdl files
 *
 * @param url
 * @param file
 * @returns {Promise}
 */
function generateWsdlFile(file, url) {
    return new Promise(function (resolve, reject) {
        log.debug("Generating WSDL's.");
        var options = {
            rejectUnauthorized: false,
            timeout: 5000
        };
        request.get(url, options, function (error, res, body) {
            if (!error && res.statusCode == 200 && body) {
                log.debug("Writing WSDL.");
                fs.writeFile(file, body, function (error) {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve();
                    }
                });
            } else {
                log.error("Could not get WSDL.");
                return reject("Could not get WSDL.");
            }
        });
    });
}

/**
 * Gets WSDL file if not found returns wsURL
 *
 * @param file
 * @param url
 * @returns {Promise}
 */
function getWSDLFile(file, url) {
    log.debug("Getting WSDL cache file.");
    return new Promise(function (resolve, reject) {
        // checks if exists wsdl file
        if (fs.existsSync(file)) {
            return resolve(file);
        } else {
            generateWsdlFile(file, url).then(function () {
                return resolve(file);
            }).catch(function (error) {
                return reject(error);
            });
        }
    });
}

/**
 * Finds function in a given Object
 *
 * @param fnName
 * @param obj
 * @returns {*}
 */
function getFn(fnName, obj) {
    if (typeof obj[fnName] === "function") {
        return obj[fnName];
    } else {
        return null;
    }
}

/**
 * Executes service call
 *
 * @param client
 * @param data
 * @param method
 * @param resultObject
 * @param errorObject
 * @param timeout
 * @returns {Promise}
 */
function execute(client, data, method, resultObject, errorObject, timeout) {
    log.debug("Executes SOAP client call with params: ", data);
    return new Promise(function (resolve, reject) {
        if (client !== null) {
            var call = getFn(method, client);
            // call service function
            if (call !== null) {
                log.debug("Executes SOAP client calling function " + method);
                call(data,
                    function (error, result) {
                        log.debug("Last Request: ", client.lastRequest);
                      if (error.message !== 'Cannot parse response' || error.body.indexOf('faultstring') > -1) {
                        return reject(errorFactory.internalError(error.body));
                        } else {
                          var err = result || undefined;
                        for (var i in errorObject) {
                          if (err[errorObject[i]]) {
                            err = err[errorObject[i]];
                          } else {
                            err = undefined;
                          }
                        }

                        if (err) {
                          log.error(errorFactory.requestErrorMessage(err));
                          return reject(errorFactory.requestErrorMessage(err));
                        } else {
                          for (var i in resultObject) {
                            if (result[resultObject[i]]) {
                              result = result[resultObject[i]];
                              } else {
                              log.error(errorFactory.internalError('Result object not exists: ' + resultObject));
                              return reject(errorFactory.internalError('Result object not exists: ' + resultObject));
                              }
                            }
                          log.debug("Service response: ", result);
                          return resolve(result);
                        }
                        }
                    }, {
                        timeout: timeout,
                        rejectUnauthorized: false,
                        strictSSL: false,
                        agent: false,
                        pool: false
                    }
                );
            } else {
                log.error("Executing SOAP Call not a function in xml " + client.wsdl.xml);
                return resolve(null);
            }
        } else {
            log.error("Client SOAP could not initialize ");
            return resolve(null);
        }
    });
}

/**
 * Set SOAP Client
 *
 * @param file
 * @param user
 * @param pass
 * @returns {Promise}
 */
function setClient(file, user, pass) {
    return new Promise(function (resolve, reject) {
        soap.createClient(file, function (error, client) {
            if (error) {
                log.error("Error creating SOAP client.", error);
                return reject(error);
            } else {
                // sets soap headers
                // setSoapHeaders(client);

                // set client security options
                client.setSecurity(new soap.BasicAuthSecurity(user, pass));
                return resolve(client);
            }
        });
    });
}

/**
 * sets the soap headers
 * @param client
 */
function setSoapHeaders(client) {
    /*    client.addSoapHeader({
     'AuthHeader': {
     'api_key': identityProvider.wsAPIKey
     }
     },
     properties.AuthHeader,
     properties.tns,
     identityProvider.wsNameSpace);
     */
}

/**
 * 1. Gets WDSL file
 * 2. Sets SOAP client
 * 3. Executes request
 * 4. Returns response
 *
 * @param filePath
 * @param url
 * @param user
 * @param pass
 * @param data
 * @param method
 * @param resultObject
 * @param errorObject
 * @param timeout
 * @returns {Promise}
 */
function call(filePath, url, user, pass, data, method, resultObject, errorObject, timeout) {
    return new Promise(function (resolve, reject) {
        return getWSDLFile(filePath, url).then(function (file) {                   // 1. Gets WDSL file
            return setClient(file, user, pass).then(function (client) {            // 2. Sets SOAP Client
                // execute service call
                return execute(client, data, method, resultObject, errorObject, timeout)
                    .then(function (result) {                                      // 3. Executes call
                        return resolve(result);                                    // 4. Returns response
                    });
            });
        }).catch(function (error) {
          return reject(error);
        });
    });
}

/**
 * Public interface
 * @type {{call: call, execute: execute, setClient: setClient}}
 */
module.exports = {
    call: call,
    execute: execute,
    setClient: setClient
};
