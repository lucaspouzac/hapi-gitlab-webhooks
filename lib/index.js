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

exports.plugin = {
    pkg: pkg,
    register: function (server, options) {
        server.auth.scheme('gitlabwebhook', internals.implementation);
    }
};

internals.implementation = (server, options) => {
    const optionsValidation = validators.options.validate(options);
    assert(optionsValidation.error === null, 'options are not valid');

    const invalidSignature = Boom.unauthorized('Invalid signature');

    return {
        authenticate: (request, h) => {
            if (!request.headers[WEBHOOK_SIGNATURE_HEADER]) {
                return invalidSignature;
            }
            const headerValidation = joi.validate(request.headers[WEBHOOK_SIGNATURE_HEADER], validators.header);
            if (headerValidation.error !== null) {
                return invalidSignature;
            }
            return h.authenticated({ credentials: WEBHOOK_SIGNATURE_HEADER});
        },
        payload: (request, h) => {
            const body = JSON.stringify(request.payload);
            const valid = options.secret === request.headers[WEBHOOK_SIGNATURE_HEADER];
            if (valid) {
                return h.continue;
            }
            return invalidSignature;
        }
    };
};
