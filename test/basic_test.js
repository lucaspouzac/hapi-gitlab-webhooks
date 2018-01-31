const expect = require('chai').expect;
const server = require('./basic_server');
const secret = 'SuperSecretKey';

let testServer;

describe('gitlab webhook handler', () => {
    before(() => {
        testServer = server.createServer(secret);
    });
    it('should be unauthorized when signature header is missing', (done) => {
        const options = {
            method: "POST",
            url: "/webhooks/gitlab"
        };
        testServer.inject(options, function(response) {
            expect(response.statusCode).to.equal(401, 'server responded with 401');
            expect(response.result.message).to.equal('Invalid signature');
            done();
        });
    });
    it('should be unauthorized when signature is not valid', (done) => {
        const options = {
            method: "POST",
            url: "/webhooks/gitlab",
            headers: {
                'X-Gitlab-Token': 'invalid'
            }
        };
        testServer.inject(options, function(response) {
            expect(response.statusCode).to.equal(401, 'server responded with 401');
            expect(response.result.message).to.equal('Invalid signature');
            done();
        });
    });
    it('should return a status of 200 if the signature is valid', (done) => {
        const payload = JSON.stringify({
            message: 'This message is valid!'
        });
        const options = {
            method: "POST",
            url: "/webhooks/gitlab",
            headers: {
                'X-Gitlab-Token': secret,
                'Content-Type': 'application/json'
            },
            payload: payload
        };

        testServer.inject(options, function(response) {
            expect(response.statusCode).to.equal(200, 'server responded with non-200 response');
            done();
        });
    });
});
