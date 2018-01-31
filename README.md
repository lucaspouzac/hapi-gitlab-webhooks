# hapi-gitlab-webhooks

Github version here: [node-github-webhook][https://github.com/mhazy/hapi-github-webhooks].


## Description

[![npm version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][dependency-image]][dependency-url]

An authentication strategy plugin for [hapi](https://github.com/hapijs/hapi) for validating webhook requests from Gitlab. This strategy validates the payload with the signature sent with the request.

The `'gitlabwebhook'` scheme takes the following options:
- `secret` - (required) the token configured for the webhook (never share or commit this to your project!)

## Usage
```javascript
var hapi = require('hapi');
var gitlabWebhooksPlugin = require('hapi-gitlab-webhooks');
var token = 'SomeUnsharedSecretToken';
var server = new hapi.Server();

server.connection({
    host: host,
    port: port
});

server.register(gitlabWebhooksPlugin, function (err) {
  // Register gitlab webhook auth strategy
  server.auth.strategy('gitlabwebhook', 'gitlabwebhook', { secret: token});
  // Apply the strategy to the route that handles webhooks
  server.route([
    {
      method: 'POST',
      path: '/webhooks/gitlab',
      config: {
          auth: {
              strategies: ['gitlabwebhook'],
              payload: 'required'
          }
      },
      handler: function(request, reply) {
        // request.payload is the validated payload from Gitlab
        reply();
      }
    }
  ]);
});
```

[npm-image]: https://badge.fury.io/js/hapi-gitlab-webhooks.svg
[npm-url]: https://npmjs.org/package/hapi-gitlab-webhooks
[build-image]: https://travis-ci.org/lucaspouzac/hapi-gitlab-webhooks.svg?branch=master
[build-url]: https://travis-ci.org/lucaspouzac/hapi-gitlab-webhooks
[dependency-image]: https://david-dm.org/lucaspouzac/hapi-gitlab-webhooks.svg
[dependency-url]: https://david-dm.org/lucaspouzac/hapi-gitlab-webhooks
