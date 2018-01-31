const Hapi = require('hapi');
const hapiGitlabWebhook = require('../lib/');

/**
 * Secret to use
 *
 * @param secret
 * @returns {*}
 */
const createServer = (secret) => {
    const server = new Hapi.Server({ debug: false });
    server.connection();

    server.register(hapiGitlabWebhook, function (err) {
        if (err) {
            throw err;
        }
        // Add the scheme and apply it to the URL
        server.auth.strategy('gitlabwebhook', 'gitlabwebhook', { secret: secret});
        server.route([
            {
                method: 'POST',
                path: '/webhooks/gitlab',
                config: {
                    auth: {
                        strategies: ["gitlabwebhook"],
                        payload: 'required'
                    }
                },
                handler: function(request, reply) {
                    reply();
                }
            }
        ]);
    });

    return server;
};

module.exports = {
    createServer
};
