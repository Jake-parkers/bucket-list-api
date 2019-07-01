const Joi = require('@hapi/joi');

class Validator {
    constructor() {}

    static validateLoginPayload (payload) {
        const schema = Joi.object().keys({
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        });
        const { error, _ } = schema.validate(payload);
        console.log(error);
        return error !== null ? error.details[0].message : null;
    }
}

module.exports = Validator;
