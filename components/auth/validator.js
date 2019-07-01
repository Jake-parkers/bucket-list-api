const Joi = require('@hapi/joi');

class Validator {
    constructor() {}

    static validateLoginPayload (payload) {
        const schema = Joi.object().keys({
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9!@#$%^&*_+={}|\/:;"'~`]{3,30}$/).required(),
        });
        const { error, _ } = schema.validate(payload);
        return error !== null ? error.details[0].message : null;
    }
}

module.exports = Validator;
