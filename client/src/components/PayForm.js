import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import moment from 'moment';
import { isEmpty, } from 'lodash';
import { regExpLiteral } from 'babel-types';

class PayForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: false,
            lastName: false,
            addressFirstLine: false,
            county: false,
            postcode: false,
            email: false,
            phone: false,
            card: false,
            paymentMethod: 'visa',
        }

        this.handleInputValidation = this.handleInputValidation.bind(this);
        this.handleCardValidation = this.handleCardValidation.bind(this);
    }

    handleInputValidation(e) {
        let strippedValue = e.target.value.toLowerCase();
        let postcodeMatch = false;
        let emailMatch = false;
        let phoneMatch = false;

        if (e.target.name !== 'addressFirstLine') {
            strippedValue = strippedValue.replace(/ /g, "");
        }

        if (e.target.name === 'postcode') {
            const postcodeRegex = RegExp('([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})');
            postcodeMatch = postcodeRegex.test(strippedValue)
        }

        if (e.target.name === 'email') {
            const emailRegex = RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$');
            emailMatch = emailRegex.test(strippedValue);
        }

        if (e.target.name === 'phone') {
            const phoneRegex = RegExp(/^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/);
            phoneMatch = phoneRegex.test(strippedValue);
        }

        switch(e.target.name) {
            case 'firstName':
                if (!isEmpty(strippedValue)) {
                    this.setState({ firstName: strippedValue });
                }
                break;
            case 'lastName':
                if (!isEmpty(strippedValue)) {
                    this.setState({ lastName: strippedValue });
                }
                break;
            case 'addressFirstLine':
                if (!isEmpty(strippedValue)) {
                    this.setState({ addressFirstLine: strippedValue }); 
                }
                break;
            case 'county':
                if (!isEmpty(strippedValue)) {
                    this.setState({ county: strippedValue });
                }
                break;
            case 'postcode':
                if (!isEmpty(strippedValue) && postcodeMatch) {
                    this.setState({ postcode: strippedValue });
                }
                break;
            case 'email': 
                if (!isEmpty(strippedValue) && emailMatch) {
                    this.setState({ email: strippedValue });
                }
            case 'phone': 
                if (!isEmpty(strippedValue) && phoneMatch) {
                    this.setState({ phone: strippedValue });
                }
            default:
                return false;
          }
    }

    handleCardValidation(e) {
        if (e.error === undefined && e.complete === true) {
            this.setState({ card: true })
        }
    }

    getEstimatedDelivery() {
        const weekday = moment().weekday();
        const time = moment().format('H')

        if (weekday < 6 || time < 14) {
            return moment().add(2, 'day').format('Do MMMM');
        } else {
            return moment().add(4, 'day').format('Do MMMM');
        }
    }
    
    handleSubmit = async (e, allFieldsValidated) => {
        e.preventDefault();

        if (allFieldsValidated) {
            try {
                const {
                    firstName,
                    lastName,
                    addressFirstLine,
                    county,
                    postcode,
                    email,
                    phone
                } = this.state;
    
                const { token } =  await this.props.stripe.createToken({ name: this.state.FirstName })
    
                // pass this value down from the checkout page
                const amount = this.props.basket.reduce((a, item) =>  item.price * item.quantity + a, 0) + this.props.deliveryCost;
    
                const quantity = this.props.basket.reduce((a, item) => parseInt(item.quantity, 10) + a, 0);
    
                const estimatedDelivery = this.getEstimatedDelivery();
    
                await fetch('/api/hello', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        estimatedDelivery,
                        addressFirstLine,
                        currency: 'GBP',
                        firstName,
                        lastName,
                        postcode,
                        quantity,
                        amount,
                        county,
                        token,
                        email,
                        phone,
                    }),
                });
    
            } catch(e) {
                console.log('whats error', e)
                throw e;
            }
        }
        return false;
    }

    render() {
        const {
            firstName,
            lastName,
            addressFirstLine,
            county,
            postcode,
            email,
            phone,
            card,
        } = this.state;

        const allFieldsValidated = [
            !!firstName,
            !!lastName,
            !!addressFirstLine,
            !!county,
            !!postcode,
            !!email,
            !!phone,
            !!card,
        ].filter(Boolean).length === 8;

        let buttonStyles;

        if (allFieldsValidated) {
            buttonStyles = { backgroundColor: '#ff6a6a' }
        } else {
            buttonStyles = { pointerEvents: 'none', boxShadow: 'none' }
        }

        return (
            <form onSubmit={(e) => this.handleSubmit(e, allFieldsValidated)}>

                <div class="input-side-by-side">
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input
                                className='text-field--input'
                                name="firstName"
                                id="firstName"
                                placeholder=' '
                                type='text'
                                onBlur={(e) => this.handleInputValidation(e)}
                            />
                            <label className='text-field--label' for='firstName'>first name</label>
                        </div>
                    </div>
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input
                                className='text-field--input'
                                name="lastName"
                                id="lastName"
                                placeholder=' '
                                type='text'
                                onBlur={(e) => this.handleInputValidation(e)}
                            />
                            <label className='text-field--label' for='lastName'>last name</label>
                        </div>
                    </div>
                </div>

                <div className='text-field--container'>
                    <div className='text-field'>
                        <input
                            className='text-field--input'
                            name="addressFirstLine"
                            id="addressFirstLine"
                            placeholder=' '
                            type='text'
                            onBlur={(e) => this.handleInputValidation(e)}    
                        />
                        <label className='text-field--label' for='address'>address line 1</label>
                    </div>
                </div>

                <div class="input-side-by-side">
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input
                                className='text-field--input'
                                name="county"
                                id="county"
                                placeholder=' '
                                type='text'
                                onBlur={(e) => this.handleInputValidation(e)}
                            />
                            <label className='text-field--label' for='county'>county</label>
                        </div>
                    </div>
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input
                                className='text-field--input'
                                name="postcode"
                                id="postcode"
                                placeholder=' '
                                type='text'
                                onBlur={(e) => this.handleInputValidation(e)}
                                style={{ textTransform: 'uppercase' }}
                            />
                            <label className='text-field--label' for='postcode'>postcode</label>
                        </div>
                    </div>
                </div>

                <div class="input-side-by-side">
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input
                                className='text-field--input'
                                name="email"
                                id="email"
                                placeholder=' '
                                type='email'
                                onBlur={(e) => this.handleInputValidation(e)}
                                style={{ textTransform: 'none' }}
                            />
                            <label className='text-field--label' for='email'>email</label>
                        </div>
                    </div>
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input
                                className='text-field--input'
                                name="phone"
                                id="phone"
                                placeholder=' '
                                type='number'
                                onBlur={(e) => this.handleInputValidation(e)}
                            />
                            <label className='text-field--label' for='phone'>phone number</label>
                        </div>
                    </div>
                </div>

                <h3 style={{ marginTop: '12px' }}>payment method</h3>
                <div className="payment-method-container">
                    <div
                        className={`payment-method ${this.state.paymentMethod === 'visa' && 'selected'}`}
                        onClick={() => this.setState({ paymentMethod: 'visa' })}
                    >
                        Visa
                    </div>
                    <div
                        className={`payment-method ${this.state.paymentMethod === 'paypal' && 'selected'}`}
                        onClick={() => this.setState({ paymentMethod: 'paypal' })}
                    >
                        Paypal
                    </div>
                </div>

                {this.state.paymentMethod === 'visa' && [
                    <CardElement
                        hidePostalCode
                        onChange={(e) => this.handleCardValidation(e)}
                    />,
                    <button
                        class="pure-material-button-contained"
                        style={buttonStyles}
                    >
                        pay now
                    </button>,
                ]}
            </form>
        );
    }
}

export default injectStripe(PayForm);