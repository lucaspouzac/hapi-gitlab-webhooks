# hapi-gitlab-webhooks

Github version here: [hapi-github-webhooks](https://github.com/mhazy/hapi-github-webhooks).


## Description

[![npm version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][dependency-image]][dependency-url]
[![Dev Dependency Status][dev-dependency-image]][dev-dependency-url]
[![Peer Dependency Status][peer-dependency-image]][peer-dependency-url]

An authentication strategy plugin for [hapi](https://github.com/hapijs/hapi) for validating webhook requests from Gitlab. This strategy validates the payload with the signature sent with the request.

The `'gitlabwebhook'` scheme takes the following options:
- `secret` - (required) the token configured for the webhook (never share or commit this to your project!)

## Version

1.1.X: compatible HAPI 17.x.x
1.0.X: compatible HAPI 16.x.x

## Usage
```javascript
var hapi = require('hapi');
var gitlabWebhooksPlugin = require('hapi-gitlab-webhooks');
var token = 'SomeUnsharedSecretToken';
var server = new hapi.Server({
    host: host,
    port: port
});

try {
    await server.register(hapiGitlabWebhook)
} catch (err) {
    throw err;
}

// Register gitlab webhook auth strategy
server.auth.strategy('gitlabwebhook', 'gitlabwebhook', { secret: token });
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
    handler: () => null
  }
]);
```

[npm-image]: https://badge.fury.io/js/hapi-gitlab-webhooks.svg
[npm-url]: https://npmjs.org/package/hapi-gitlab-webhooks
[build-image]: https://travis-ci.org/lucaspouzac/hapi-gitlab-webhooks.svg?branch=master
[build-url]: https://travis-ci.org/lucaspouzac/hapi-gitlab-webhooks
[dependency-image]: https://david-dm.org/lucaspouzac/hapi-gitlab-webhooks.svg
[dependency-url]: https://david-dm.org/lucaspouzac/hapi-gitlab-webhooks
[dev-dependency-image]: https://david-dm.org/lucaspouzac/hapi-gitlab-webhooks/dev-status.svg
[dev-dependency-url]: https://david-dm.org/lucaspouzac/hapi-gitlab-webhooks?type=dev
[peer-dependency-image]: https://david-dm.org/lucaspouzac/hapi-gitlab-webhooks/peer-status.svg
[peer-dependency-url]: https://david-dm.org/lucaspouzac/hapi-gitlab-webhooks?type=peer
