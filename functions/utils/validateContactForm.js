const Joi = require('@hapi/joi');
const validateContactForm = ({ name, email, message }) => {
    console.log('name', name)
    console.log('email', email);
    console.log('message', message)

    const schema = Joi.object({
        name: Joi.string().required().min(2).max(100),
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