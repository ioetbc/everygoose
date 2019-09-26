import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios';
import uuid from 'uuid/v4';

import estimatedDelivery from './utils/EstimatedDelivery';
import { generic, postcode, email, phone } from '../schema/PaySchema';

class PayForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stripeComplete: false,
            isLoading: false,
            firstName: '',
            lastName: '',
            email: '',
            basket: [],
            address: '',
            county: '',
            postcode: '',
            phoneNumber: '',
        }

        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    async handleSubmit(e, allValid) {
        e.preventDefault();

        if (allValid && this.state.stripeComplete) {
            // const inputs = [...document.getElementsByTagName('input')]
            // inputs.map(i => i.value = '');
            const { token } = await this.props.stripe.createToken({ name: 'william' })
            this.setState({ isLoading: true });

            axios({
                method: 'post',
                url: process.env.REACT_APP_PAY_ENDPOINT,
                config: {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                },
                data: {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    basket: this.props.basket,
                    address: this.state.address,
                    county: this.state.county,
                    postcode: this.state.postcode,
                    phoneNumber: this.state.phone,
                    stripeToken: token.id,
                    idempotencyKey: uuid(),
                    estimatedDelivery: estimatedDelivery(),
                },
            })
            .then(function (response) {
                console.log('the respoonse', response);
            })
            .catch(function (error) {
                console.log('the error', error);
            });
        }

        return false;
    }

    handleInput(e) {
        e.preventDefault();

        switch(e.target.name) {
            case 'firstName':
                if (generic.validate({ generic: e.target.value }).error) {
                    this.setState({ firstNameError: 'Whoops, please check your answer to continue.' })
                } else {
                    this.setState({ firstName: e.target.value, firstNameError: false });
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
                    this.setState({ addressError: 'Whoops, please check your answer to continue.' })
                } else {
                    this.setState({ address: e.target.value, addressError: false });
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
    };

    render() {
        const {
            firstNameError,
            lastNameError,
            addressError,
            countyError,
            postcodeError,
            emailError,
            phoneError,
            stripeComplete,
            isLoading
        } = this.state;

        const hasErrors = [...document.getElementsByClassName('error-message')].length > 0;
        let allValid = false;
        if (
            firstNameError === false &&
            lastNameError === false &&
            addressError === false &&
            countyError === false &&
            postcodeError === false &&
            emailError === false &&
            phoneError === false &&
            !hasErrors
        ) {
            allValid = true;
        }

        const disableButton = (allValid && stripeComplete);

        return (
            <form onSubmit={(e) => this.handleSubmit(e, allValid)}>
            <h3 style={{ marginTop: '12px' }}>Personal details</h3>
                <div class="input-side-by-side">
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input
                                className='text-field--input'
                                name="firstName"
                                id="firstName"
                                placeholder=' '
                                type='text'
                                onBlur={(e) => this.handleInput(e)}
                            />
                            <label className='text-field--label' for='firstName'>first name</label>
                        </div>
                        {firstNameError && <p className="error-message">{firstNameError}</p>}
                    </div>
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input
                                className='text-field--input'
                                name="lastName"
                                id="lastName"
                                placeholder=' '
                                type='text'
                                onBlur={(e) => this.handleInput(e)}
                            />
                            <label className='text-field--label' for='lastName'>last name</label>
                        </div>
                        {lastNameError && <p className="error-message">{lastNameError}</p>}
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
                            onBlur={(e) => this.handleInput(e)}   
                        />
                        <label className='text-field--label' for='address'>address line 1</label>
                    </div>
                    {addressError && <p className="error-message">{addressError}</p>}
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
                                onBlur={(e) => this.handleInput(e)}
                            />
                            <label className='text-field--label' for='county'>county</label>
                        </div>
                        {countyError && <p className="error-message">{countyError}</p>}
                    </div>
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input
                                className='text-field--input'
                                name="postcode"
                                id="postcode"
                                placeholder=' '
                                type='text'
                                onBlur={(e) => this.handleInput(e)}
                                style={{ textTransform: 'uppercase' }}
                            />
                            <label className='text-field--label' for='postcode'>postcode</label>
                        </div>
                        {postcodeError && <p className="error-message">{postcodeError}</p>}
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
                                onBlur={(e) => this.handleInput(e)}
                                style={{ textTransform: 'none' }}
                            />
                            <label className='text-field--label' for='email'>email</label>
                        </div>
                        {emailError && <p className="error-message">{emailError}</p>}
                    </div>
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input
                                className='text-field--input'
                                name="phone"
                                id="phone"
                                placeholder=' '
                                type='number'
                                onBlur={(e) => this.handleInput(e)}
                            />
                            <label className='text-field--label' for='phone'>phone number</label>
                        </div>
                        {phoneError && <p className="error-message">{phoneError}</p>}
                    </div>
                </div>

                <h3 style={{ marginTop: '12px' }}>Payment</h3>

                <CardElement	
                    hidePostalCode
                    onChange={(e) => this.setState({ stripeComplete: e.complete })}
                />

                <button 
                    type="submit"
                    className={`button ${!disableButton && 'disabled'}`}
                >
                    pay now
                </button>
            </form>
        );
    }
}

export default injectStripe(PayForm);