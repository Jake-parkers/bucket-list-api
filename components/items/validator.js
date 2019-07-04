const Joi = require('@hapi/joi');

class Validator {
    constructor() {}

    static validateNewItemPayload(payload) {
        const schema = Joi.object().keys({
            name: Joi.string().regex(/^[a-zA-Z]+/).required(),
            done: Joi.boolean(),
            user_id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
            id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
        });
        const { error, _ } = schema.validate(payload);
        return error !== null ? error.details[0].message : null;
    }

    static validateFetchAllItemsPayload(payload) {
        const schema = Joi.object().keys({
            user_id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
            id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
        });
        const { error, _ } = schema.validate(payload);
        return error !== null ? error.details[0].message : null;
    }

    static validateFetchItemPayload(payload) {
        const schema = Joi.object().keys({
            user_id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
            id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
            item_id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
        });
        const { error, _ } = schema.validate(payload);
        return error !== null ? error.details[0].message : null;
    }

    static validateUpdateItemPayload(payload) {
        const schema = Joi.object().keys({
            user_id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
            id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
            item_id: Joi.string().regex(/^[a-zA-Z0-9-]+/).required(),
            name: Joi.string().regex(/^[a-zA-Z]+/).required(),
            done: Joi.boolean().required(),
        });
        const { error, _ } = schema.validate(payload);
        return error !== null ? error.details[0].message : null;
    }
}

module.exports = Validator;
