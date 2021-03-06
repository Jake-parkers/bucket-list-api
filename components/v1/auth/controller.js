const AuthService = require('./service');
const service = new AuthService();
const Response = require('../../../libraries/response');
const Validator = require('./validator');
const Errors = require('../../../libraries/errors');

class BucketListController {
    constructor() {}

    login(payload) {
        return new Promise((resolve, reject) => {
            const error = Validator.validateLoginPayload(payload);
            if (error !== null) resolve(new Response('error', Errors.invalid_params, error, 400));
            else {
                service.login(payload)
                    .then(result => {
                        if (result === false) resolve(new Response('error', Errors.invalid_login, 'Username or password incorrect', 400));
                        else resolve(new Response('success', Errors.none, {token: result}, 200));
                    }).catch(error => {
                        reject(new Response('error', Errors.server_error, error.message, 500));
                    })
            }
        })
    }

    register(payload) {
        return new Promise((resolve, reject) => {
            const error = Validator.validateLoginPayload(payload);
            if (error !== null)  resolve(new Response('error', Errors.invalid_params, error, 400));
            else {
                service.register(payload)
                    .then(result => {
                        if (result === false)  resolve(new Response('error', Errors.user_exists, 'An account with this email exists', 400));
                        else resolve(new Response('success', Errors.none, 'User created successfully', 200));
                    }).catch(error => {
                        reject(new Response('error', Errors.server_error, error.message, 500));
                    })
            }
        })
    }

}

module.exports = BucketListController;
