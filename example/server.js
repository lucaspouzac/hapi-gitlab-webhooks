const Hapi = require('hapi');
const hapiGitlabWebhook = require('../lib/');
const port = process.env.PORT || 4005;
const host = process.env.HOST || '0.0.0.0';
const secret = process.env.SECRET || 'RandomSecretToken'; // Never Share This!

async function example() {
  const server = new Hapi.Server({
      host: host,
      port: port
  });
  try {
      await server.register(hapiGitlabWebhook)
  } catch (err) {
      throw err;
  }

  // see: http://hapijs.com/api#serverauthschemename-scheme
  server.auth.strategy('gitlabwebhook', 'gitlabwebhook', { secret: secret });

  server.route([
      {
          method: 'GET', path: '/', config: {},
          handler: function(request, h) {
              return 'ok';
          }
      },
      {
          method: 'POST',
          path: '/webhooks/gitlab',
          config: {
              auth: {
                  strategies: ["gitlabwebhook"],
                  payload: 'required'
              }
          },
          handler: () => null
      }
  ]);

  try {
      await server.start();
  }
  catch (err) {
      console.log(err);
  }
  console.log('Server running at:', server.info.uri);
}

example();
