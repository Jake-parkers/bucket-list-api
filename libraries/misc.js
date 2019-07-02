const bcrypt = require('bcrypt');
class Misc {
    constructor(props) {}

    static hashPassword(plainPassword) {
        const saltRounds = 10;
        return new Promise((resolve, reject) => {
            bcrypt.hash(plainPassword, saltRounds)
                .then(hash => {
                    resolve(hash);
                }).catch(_ => {
                    reject(new Error('Oops!! An error occurred'));
                })
        });
    }

    static comparePassword(plainPassword, hash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainPassword, hash)
                .then(result => {
                    // result is either true or false - according to bcrypt's doc
                    resolve(result);
                }).catch(error => {

                    reject(new Error('Oops!! An error occurred.'));
                })
        });
    }

    static formattedResponse(response) {
        return {
            status: response.status,
            type: response.type,
            message: response.message
        }
    }
}

module.exports = Misc;
