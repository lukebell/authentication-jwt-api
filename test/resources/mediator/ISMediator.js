var isMediator = require('./ISMediator');
var conf = require('../.././config');

describe("IdpMediator Integration test", function () {

    describe("Test oAuth Authentication with correct credentials", function () {
        it("return the oAuth Token", function () {
            isMediator.getISOAuthAccessToken("avasquez@cablevision.com.ar", "axel1234", {
                consumer: 'hbBF4MWiBC8KxAMBrM5YirQ8AW8a',
                secret: 'dNN5uOPCuQ2Zg8Nc1thlSBdBWSka'
            });
        });
        it("return the JWT Token", function () {
            isMediator.call({
                validationReqDTO: {
                    accessToken: {
                        identifier: 'efe58da0fcf11df68f5d7058457dfe13',
                        tokenType: conf.soapJWTValidate.tokenType
                    },
                    requiredClaimURIs: conf.soapJWTValidate.requiredClaimURIs
                }
            });
        });
    });
});