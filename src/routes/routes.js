var specs = require('./specs').specs();
var validator = require('../routes/validator/validator');
var isMediator = require('../resources/mediator/ISMediator');
var Logger = require('../resources/logger/logger');
var log = new Logger().getSystemLogger();

/**
 * Action for Authentication Service
 */
var authenticate = {
    'spec': specs.specAuthenticate,
    'action': function (req, res) {
      log.debug("Authenticate service");

      var consumerKey = req.headers.oauth_consumer_key;
      var consumerSecret = req.headers.oauth_consumer_secret;
      var username = req.params.username;
      var password = req.params.password;

      validator.checkParams.authenticate(consumerKey, consumerSecret, username, password)
        .then(function () {
          log.info('Calling authenticate service with parameters consumerKey: [' + consumerKey
            + '], consumerSecret: [' + consumerSecret + '], username: [' + username + '] + password: [' + password + ']');
          isMediator.getOAuthAccessToken(username, password, consumerKey, consumerSecret).then(function (oauthToken) {
            var accessToken = oauthToken.access_token;
            var opt = req.params.options && req.params.options !== "undefined" ? JSON.parse(req.params.options) : undefined;
            isMediator.getValidJWT(accessToken, opt).then(function (response) {
              res.send({accessToken: accessToken, jwt: response.authorizationContextToken.tokenString});
            }).catch(function (error) {
              res.send(error.code, JSON.parse(JSON.stringify(error)));
            });
          }).catch(function (error) {
            res.send(error.code, JSON.parse(JSON.stringify(error)));
          });
        }).catch(function (error) {
        res.send(error.code, JSON.parse(JSON.stringify(error)));
      });
    }
};

/**
 * Action for Validate Service
 */
var validate = {
    'spec': specs.specValidate,
    'action': function (req, res) {
      log.debug("Validate service");

      var accessToken = req.params.token;

      validator.checkParams.validate(accessToken)
        .then(function () {
          log.info('Calling validate service with parameters accessToken: [' + accessToken
            + ']');
          var opt = req.params.options && req.params.options !== "undefined" ? JSON.parse(req.params.options) : undefined;
          isMediator.getValidJWT(accessToken, opt).then(function (response) {
            res.send({isValid: response.valid});
          }).catch(function (error) {
            res.send(error.code, JSON.parse(JSON.stringify(error)));
          });
        }).catch(function (error) {
        res.send(error.code, JSON.parse(JSON.stringify(error)));
      });
    }
};

/**
 * Action for revoke Service
 */
var revoke = {
    'spec': specs.specRevoke,
    'action': function (req, res) {
      log.debug("Revoke service");

      var consumerKey = req.headers.oauth_consumer_key;
      var consumerSecret = req.headers.oauth_consumer_secret;
      var accessToken = req.params.token;

      validator.checkParams.revoke(consumerKey, consumerSecret, accessToken)
        .then(function () {
          log.info('Calling revoke service with parameters accessToken: [' + accessToken + ']');
          isMediator.revokeOAuthAccessToken(accessToken, consumerKey, consumerSecret).then(function () {
            res.send();
          }).catch(function (error) {
            res.send(error.code, JSON.parse(JSON.stringify(error)));
          });
        }).catch(function (error) {
        res.send(error.code, JSON.parse(JSON.stringify(error)));
      });
    }
};

/**
 * Public interface
 * @type {{validate: {spec: *, action: validate.'action'}, authenticate: {spec: *, action: authenticate.'action'}, revoke: {spec: *, action: revoke.'action'}}}
 */
module.exports = {
    validate: validate,
    authenticate: authenticate,
    revoke: revoke
};