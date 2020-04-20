const Joi = require('@hapi/joi');

class Validator {
    constructor() {}

    static validateNewBucketPayload(payload) {
        const schema = Joi.object().keys({
            name: Joi.string().regex(/^[a-zA-Z]+/).required(),
            user_id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
        });
        const { error, _ } = schema.validate(payload);
        return error !== null ? error.details[0].message : null;
    }

    static validateFetchUserBucketsPayload(payload) {
        const schema = Joi.object().keys({
            user_id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
            q: Joi.string().regex(/^[a-zA-Z]+/),
            limit: Joi.number(),
            page: Joi.number()
        });
        const { error, _ } = schema.validate(payload);
        return error !== null ? error.details[0].message : null;
    }

    static validateFetchSingleBucketPayload(payload) {
        const schema = Joi.object().keys({
            user_id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
            id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
        });
        const { error, _ } = schema.validate(payload);
        return error !== null ? error.details[0].message : null;
    }

    static validateUpdateBucketPayload(payload) {
        const schema = Joi.object().keys({
            name: Joi.string().regex(/^[a-zA-Z]+/).required(),
            user_id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
            id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
        });
        const { error, _ } = schema.validate(payload);
        return error !== null ? error.details[0].message : null;
    }

    static validateFindBucketPayload(payload) {
        const schema = Joi.object().keys({
            q: Joi.string().regex(/^[a-zA-Z]+/),
            user_id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
        });
        const { error, _ } = schema.validate(payload);
        return error !== null ? error.details[0].message : null;
    }
}

module.exports = Validator;
