const expect = require('chai').expect;
const server = require('./basic_server');
const secret = 'SuperSecretKey';

let testServer;

describe('gitlab webhook handler', () => {
    before(async() => {
        testServer = await server.createServer(secret);
    });
    it('should be unauthorized when signature header is missing', async() => {
        const options = {
            method: "POST",
            url: "/webhooks/gitlab"
        };
        const response = await testServer.inject(options);

        expect(response.statusCode).to.equal(401, 'server responded with 401');
        expect(response.result.message).to.equal('Invalid signature');

    });
    it('should be unauthorized when signature is not valid', async() => {
        const options = {
            method: "POST",
            url: "/webhooks/gitlab",
            headers: {
                'X-Gitlab-Token': 'invalid'
            }
        };
        const response = await testServer.inject(options);

        expect(response.statusCode).to.equal(401, 'server responded with 401');
        expect(response.result.message).to.equal('Invalid signature');
    });
    it('should return a status of 200 if the signature is valid', async() => {
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

        const response = await testServer.inject(options);

        expect(response.statusCode).to.equal(200, 'server responded with non-200 response');
    });
});

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}
