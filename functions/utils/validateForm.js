const Joi = require('@hapi/joi');
const validateForm = (data) => {
    console.log(1)
        const {
            firstName,
            lastName,
            email,
            addressFirst,
            addressSecond,
            addressThird,
            city,
            county,
            postcode,
            phoneNumber,
        } = data;

        console.log('data', data)
        const schema = Joi.object({
            firstName: Joi.string().required().min(2).max(50),
            lastName: Joi.string().required().min(2).max(50),
            //eslint-disable-next-line
            email: Joi.string().required().pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
            addressFirst: Joi.string().required().min(2).max(50),
            addressSecond: Joi.string().max(50).allow('').optional(),
            addressThird: Joi.string().max(50).allow('').optional(),
            city: Joi.string().required().min(2).max(50),
            county: Joi.string().required().min(2).max(50),
            //eslint-disable-next-line
            postcode: Joi.string().required().pattern(/^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i),
            //eslint-disable-next-line
            phoneNumber: Joi.string().required().pattern(/^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/i),
        });

        let validationSuccess = true;
        validationSuccess = !schema.validate({
            firstName,
            lastName,
            email,
            addressFirst,
            addressSecond,
            addressThird,
            city,
            county,
            postcode,
            phoneNumber,
        }).error;

        console.log('wtf', validationSuccess);

    return validationSuccess;
}

module.exports = validateForm;