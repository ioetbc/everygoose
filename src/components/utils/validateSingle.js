import { generic, postcode, email, phone, genericNotRequired } from '../../schema/PaySchema';

export default function validateSingle(e) {
    let validate = {
        error: false,
        errorMessage: '',
    };
    switch(e.target.name) {
        case 'firstName':
            if (generic.validate({ generic: e.target.value }).error) {
                validate.error = true;
                validate.errorMessage = 'Whoops, please check your answer to continue.';
                return validate;
            }
        break;
        case 'lastName':
            if (generic.validate({ generic: e.target.value }).error) {
                validate.error = true;
                validate.errorMessage = 'Whoops, please check your answer to continue.';
                return validate;
            }
        break;
        case 'addressFirstLine':
            if (generic.validate({ generic: e.target.value }).error) {
                validate.error = true;
                validate.errorMessage = 'Whoops, please check your answer to continue.';
                return validate;
            }
        break
        case 'addressSecondLine':
            if (genericNotRequired.validate({ genericNotRequired: e.target.value }).error) {
                validate.error = true;
                validate.errorMessage = 'Whoops, please check your answer to continue.';
                return validate;
            }
        break
        case 'addressThirdLine':
            if (genericNotRequired.validate({ genericNotRequired: e.target.value }).error) {
                validate.error = true;
                validate.errorMessage = 'Whoops, please check your answer to continue.';
                return validate;
            }
        break;
        case 'city':
            if (generic.validate({ generic: e.target.value }).error) {
                validate.error = true;
                validate.errorMessage = 'Whoops, please check your answer to continue.';
                return validate;
            }
        break;
        case 'county':
            if (generic.validate({ generic: e.target.value }).error) {
                validate.error = true;
                validate.errorMessage = 'Whoops, please check your answer to continue.';
                return validate;
            }
        break;
        case 'postcode':
            if (postcode.validate({ postcode: e.target.value }).error) {
                validate.error = true;
                validate.errorMessage = 'Whoops, please check your answer to continue.';
                return validate;
            }
        break;
        case 'email':
            if (email.validate({ email: e.target.value }).error) {
                validate.error = true;
                validate.errorMessage = 'Whoops, please check your answer to continue.';
                return validate;
            }
        break;
        case 'phone':
            if (phone.validate({ phone: e.target.value }).error) {
                validate.error = true;
                validate.errorMessage = 'Whoops, please check your answer to continue.';
                return validate;
            }
        break;
    }
}