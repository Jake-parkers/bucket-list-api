const AuthModel = require('./model');
const Misc = require('../../libraries/misc');
const Response = require('../../libraries/response');
const Validator = require('./validator');
const Errors = require('../../libraries/errors');
const Jwt = require('../../libraries/jwt');

const JwtPayload = {
    iss: "",
    aud: "",
    exp: 0,
    iat: 0
};

class AuthService {
    constructor () {}

    login(payload) {
        const User = new AuthModel(payload.email, payload.password);
        return new Promise((resolve, reject) => {
            User.userExists().then(user => {
                if (user === null) resolve(false); // user doesn't exist
                Misc.comparePassword(User.password, user.hash)
                    .then(result => {
                        if (result === true) {
                            // Passwords match. send access token to user
                            let payload = Object.assign({}, JwtPayload);
                            payload.aud = process.env.API_AUDIENCE;
                            payload.iss = process.env.API_ISSUER;
                            payload.exp = Math.floor(Date.now() / 1000) + (60 * 43800); // expires in a month
                            payload.iat = Math.floor(Date.now() / 1000);
                            Jwt.issueToken(payload)
                                .then(jwt => {
                                    resolve(jwt);
                                }).catch(error => {
                                    reject(error);
                                })
                        } else {
                            resolve(false);
                        }
                    }).catch(_ => {
                        reject(new Error('Oops. An error occurred'));
                    });
                }).catch(_ => {
                    reject(new Error('Oops. An error occurred'));
                });
        });
    }

    register(payload) {
        const User = new AuthModel(payload.email, payload.password);
        return new Promise((resolve, reject) => {{
            User.userExists()
                .then(user => {
                    if (user != null) resolve(false);
                    else {
                        Misc.hashPassword(payload.password).then(hash => {
                            const User = new AuthModel(payload.email, hash);
                            User.save().then(result => {
                                resolve(result); // true or false
                            }).catch(error => {
                                reject(error);
                            })
                        }).catch(error => {
                            reject(error);
                        })
                    }
                })
        }});
    }
}

module.exports = AuthService;
