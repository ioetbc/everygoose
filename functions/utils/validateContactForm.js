const Joi = require('@hapi/joi');
const validateContactForm = ({ name, email, message }) => {
    const schema = Joi.object({
        name: Joi.string().required().min(2).max(100),
        //eslint-disable-next-line
        email: Joi.string().required().pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
        message: Joi.string().required().min(2).max(1500)
    });

    let validationSuccess = true;
    validationSuccess = !schema.validate({
        name,
        email,
        message
    }).error;

    return validationSuccess;
}

module.exports = validateContactForm;