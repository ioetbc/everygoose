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
                this.setState({ lastNameError: 'Whoops, please check your answer to continue.' })
            } else {
                this.setState({ lastName: e.target.value, lastNameError: false });
            }
        break;
        case 'addressFirstLine':
            if (generic.validate({ generic: e.target.value }).error) {
                this.setState({ addressFirstError: 'Whoops, please check your answer to continue.' })
            } else {
                this.setState({ addressFirst: e.target.value, addressFirstError: false });
            }
        break
        case 'addressSecondLine':
            if (genericNotRequired.validate({ genericNotRequired: e.target.value }).error) {
                this.setState({ addressSecondError: 'Whoops, please check your answer.' })
            } else {
                this.setState({ addressSecond: e.target.value });
            }
        break
        case 'addressThirdLine':
            if (genericNotRequired.validate({ genericNotRequired: e.target.value }).error) {
                this.setState({ addressThirdError: 'Whoops, please check your answer.' })
            } else {
                this.setState({ addressThird: e.target.value });
            }
        break;
        case 'city':
            if (generic.validate({ generic: e.target.value }).error) {
                this.setState({ cityError: 'Whoops, please check your answer to continue.' })
            } else {
                this.setState({ city: e.target.value, cityError: false });
            }
        break;
        case 'county':
            if (generic.validate({ generic: e.target.value }).error) {
                this.setState({ countyError: 'Whoops, please check your answer to continue.' })
            } else {
                this.setState({ county: e.target.value, countyError: false });
            }
        break;
        case 'postcode':
            if (postcode.validate({ postcode: e.target.value }).error) {
                this.setState({ postcodeError: 'Whoops, please check your answer to continue.' })
            } else {
                this.setState({ postcode: e.target.value, postcodeError: false });
            }
        break;
        case 'email':
            if (email.validate({ email: e.target.value }).error) {
                this.setState({ emailError: 'Whoops, please check your answer to continue.' })
            } else {
                this.setState({ email: e.target.value, emailError: false });
            }
        break;
        case 'phone':
            if (phone.validate({ phone: e.target.value }).error) {
                this.setState({ phoneError: 'Whoops, please check your answer to continue.' })
            } else {
                this.setState({ phone: e.target.value, phoneError: false });
            }
        break;
    }
}