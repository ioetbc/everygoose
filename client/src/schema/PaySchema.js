import Joi from '@hapi/joi';

export const PaySchema = Joi.object({
    firstName: Joi.string().required().min(2).max(25).error(() => new Error('whoops, please check your first name')),
    lastName: Joi.string().required().min(2).max(25).error(() => new Error('whoops, please check your last name')),
    addressFirstLine: Joi.string().required().min(4).max(50).error(() => new Error('whoops, please check your address')),
    county: Joi.string().required().min(3).max(25).error(() => new Error('whoops, please check your county')),
    postcode: Joi.string().required().error(() => new Error('whoops, please check your postcode')),
    email: Joi.string().required().error(() => new Error('whoops, please check your email')),
    phone: Joi.string().required().error(() => new Error('whoops, please check your phone number')),
});