var restify = require('restify');
var url = require("url");
var swagger = require("swagger-node-restify");
var routes = require('./routes/routes');
var conf = require('./config/config');
var Logger = require('./resources/logger/logger');
var log = new Logger().getSystemLogger();

var server = restify.createServer({
    name: 'authentication-jwt-api',
    version: '1.0.0',
    log: log  // Pass our logger to server
});

server.use(restify.gzipResponse());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());

restify.defaultResponseHeaders = function (data) {
    this.header('Access-Control-Allow-Origin', '*');
};

// sets CORS
restify.CORS.ALLOW_HEADERS.push('accept');
restify.CORS.ALLOW_HEADERS.push('sid');
restify.CORS.ALLOW_HEADERS.push('lang');
restify.CORS.ALLOW_HEADERS.push('origin');
restify.CORS.ALLOW_HEADERS.push('withcredentials');
restify.CORS.ALLOW_HEADERS.push('x-requested-with');
restify.CORS.ALLOW_HEADERS.push('oauth_consumer_key');
restify.CORS.ALLOW_HEADERS.push('oauth_consumer_secret');
server.use(restify.CORS());

// This is a sample validator.  It simply says that for _all_ POST, DELETE, PUT  methods,
// the header api_key OR query param api_key must be equal to the string literal
// special-key.  All other HTTP ops are A-OK */
/*
 swagger.addValidator(
 function validate(req, path, httpMethod) {
 //  example, only allow POST for api_key="special-key"
 if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
 var apiKey = req.headers["api_key"];
 if (!apiKey) {
 apiKey = url.parse(req.url,true).query["api_key"];
 }
 return "special-key" == apiKey;
 }
 return true;
 }
 );
 */

// Sets API info
swagger.setApiInfo(conf.swaggerApiInfo);
swagger.setAuthorizations(conf.swaggerAuthorizations);

// Sets server swagger handler
swagger.setAppHandler(server);

// Add API routes
swagger.addPost(routes.authenticate);
swagger.addPost(routes.validate);
swagger.addPost(routes.revoke);

// Configures the app's base path and api version.
swagger.configureSwaggerPaths("", "api-docs", "");
swagger.configure('http://' + conf.host + ':' + conf.port, '1.0.0');

// Starts server
server.listen(conf.port, conf.host, function () {
    log.info('%s listening at %s', server.name, server.url);
});

// Logger manage
server.on('uncaughtException', function (req, res, route, err) {
    var auditer = restify.auditLogger({log: log});
    auditer(req, res, route, err);
    res.send(500, "Unexpected error occured");
});

server.on('after', function (req, res, route, err) {
    if (route &&
        (
            route.spec.path === '_health'
        )
    ) {
        //Skip auditor logging if its health request
        return;
    }
    var auditer = restify.auditLogger({log: log});
    auditer(req, res, route, err);
});
