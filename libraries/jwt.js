const jwt = require('jsonwebtoken');

class Jwt {
    constructor() {}

    static issueToken(payload) {
        return new Promise((resolve, reject) => {
            Jwt.signToken(payload)
                .then(jwt => {
                    resolve(jwt);
                }).catch(error => {
                    reject(error);
            })
        });
    }

    static signToken(payload) {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256' }, (error, jwt) => {
                if (error) reject(error);
                else resolve(jwt);
            });
        });
    }
}

module.exports = Jwt;
