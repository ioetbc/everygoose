import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios';
import { find } from 'lodash';

import EstimatedDelivery from './utils/EstimatedDelivery';
import { generic, postcode, email, phone } from '../schema/PaySchema';

class PayForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stripeComplete: false,
        }

        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    async handleSubmit(e, allValid) {
        e.preventDefault();

        if (allValid && this.state.stripeComplete) {
            const { token } = await this.props.stripe.createToken({ name: 'william' })
            axios({
                method: 'post',
                url: process.env.REACT_APP_PAY_ENDPOINT,
                config: {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                },
                data: {
                    firstName: 'firstName',
                    lastName: 'lastName',
                    email: 'emai', 
                    items: 'items',
                    address: 'address',
                    phoneNumber: 'phoneNumber',
                    stripeToken: token.id,
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
                    this.setState({ firstNameError: false });
                }
            break;
            case 'lastName':
                if (generic.validate({ generic: e.target.value }).error) {
                    this.setState({ lastNameError: 'Whoops, please check your answer to continue.' })
                } else {
                    this.setState({ lastNameError: false });
                }
            break;
            case 'addressFirstLine':
                if (generic.validate({ generic: e.target.value }).error) {
                    this.setState({ addressError: 'Whoops, please check your answer to continue.' })
                } else {
                    this.setState({ addressError: false });
                }
            break;
            case 'county':
                if (generic.validate({ generic: e.target.value }).error) {
                    this.setState({ countyError: 'Whoops, please check your answer to continue.' })
                } else {
                    this.setState({ countyError: false });
                }
            break;
            case 'postcode':
                if (postcode.validate({ postcode: e.target.value }).error) {
                    this.setState({ postcodeError: 'Whoops, please check your answer to continue.' })
                } else {
                    this.setState({ postcodeError: false });
                }
            break;
            case 'email':
                if (email.validate({ email: e.target.value }).error) {
                    this.setState({ emailError: 'Whoops, please check your answer to continue.' })
                } else {
                    this.setState({ emailError: false });
                }
            break;
            case 'phone':
                if (phone.validate({ phone: e.target.value }).error) {
                    this.setState({ phoneError: 'Whoops, please check your answer to continue.' })
                } else {
                    this.setState({ phoneError: false });
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
            stripeComplete
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

                <button type="submit" className={`button ${!disableButton && 'disabled'}`}>
                    pay now
                </button>
            </form>
        );
    }
}

export default injectStripe(PayForm);