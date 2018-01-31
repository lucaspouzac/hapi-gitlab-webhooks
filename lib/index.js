'use strict';

const Boom = require('boom'); // error handling https://github.com/hapijs/boom
const assert = require('assert');
const pkg = require('../package.json');
const internals = {}; // Declare internals >> see: http://hapijs.com/styleguide
const joi = require('joi');
const WEBHOOK_SIGNATURE_HEADER = 'x-gitlab-token';

const validators = {
    header: joi.string().required(),
    options: joi.object({
        secret: joi.string().min(1).required()
    })
};

/**
 * Register plugin
 *
 * @param server
 * @param options
 * @param next
 * @returns {*}
 */
const register = (server, options, next) => {
    server.auth.scheme('gitlabwebhook', internals.implementation);
    next();
};

register.attributes = {
    pkg: pkg
};

exports.register = register;

internals.implementation = (server, options) => {
    const optionsValidation = validators.options.validate(options);
    assert(optionsValidation.error === null, 'options are not valid');

    const invalidSignature = Boom.unauthorized('Invalid signature');

    return {
        authenticate: (request, reply) => {
            if (!request.headers[WEBHOOK_SIGNATURE_HEADER]) {
                return reply(invalidSignature);
            }
            const headerValidation = joi.validate(request.headers[WEBHOOK_SIGNATURE_HEADER], validators.header);
            if (headerValidation.error !== null) {
                return reply(invalidSignature);
            }
            reply.continue({ credentials: WEBHOOK_SIGNATURE_HEADER});
        },
        payload: (request, reply) => {
            const body = JSON.stringify(request.payload);
            const valid = options.secret === request.headers[WEBHOOK_SIGNATURE_HEADER];
            if (valid) {
                return reply.continue();
            }
            reply(invalidSignature);
        }
    };
};
