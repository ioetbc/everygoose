import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios';
import uuid from 'uuid/v4';

import estimatedDelivery from './utils/EstimatedDelivery';
import { generic, postcode, email, phone, genericNotRequired } from '../schema/PaySchema';

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
            addressFirst: '',
            addressSecond: '',
            addressThird : '',
            city: '',
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
            const theyOrIt = this.props.length > 1 ? 'They' : 'It';
            const cardOrCards = this.props.basket.length > 1 ? 'cards' : 'card';
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
                    addressFirst: this.state.addressFirst,
                    addressSecond: this.state.addressSecond,
                    addressThird: this.state.addressThird,
                    city: this.state.city,
                    county: this.state.county,
                    postcode: this.state.postcode,
                    phoneNumber: this.state.phone,
                    stripeToken: token.id,
                    idempotencyKey: uuid(),
                    estimatedDelivery: estimatedDelivery(),
                    cardOrCards,
                    theyOrIt,
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
                    this.setState({ addressFirstError: 'Whoops, please check your answer to continue.' })
                } else {
                    this.setState({ addressFirst: e.target.value, addressFirstError: false });
                }
            break
            case 'addressSecondLine':
                if (genericNotRequired.validate({ genericNotRequired: e.target.value }).error) {
                    this.setState({ addressSecondError: 'Whoops, please check your answer.' })
                } else {
                    this.setState({ addressSecond: e.target.value, addressSecondError: false });
                }
            break
            case 'addressThirdLine':
                if (genericNotRequired.validate({ genericNotRequired: e.target.value }).error) {
                    this.setState({ addressThirdError: 'Whoops, please check your answer.' })
                } else {
                    this.setState({ addressThird: e.target.value, addressThirdError: false });
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
    };

    render() {
        const {
            firstNameError,
            lastNameError,
            addressFirstError,
            addressSecondError,
            addressThirdError,
            cityError,
            countyError,
            postcodeError,
            emailError,
            phoneError,
            stripeComplete,
        } = this.state;

        const hasErrors = [...document.getElementsByClassName('error-message')].length > 0;
        let allValid = false;
        if (
            firstNameError === false &&
            lastNameError === false &&
            addressFirstError === false &&
            addressSecondError === false &&
            addressThirdError === false &&
            cityError === false &&
            countyError === false &&
            postcodeError === false &&
            emailError === false &&
            phoneError === false &&
            !hasErrors
        ) {
            allValid = true;
        }


        console.log('ummmmmm', this.props.basket.reduce((a, item) => parseInt(item.quantity, 10) + a, 0))

        const disableButton = (allValid && stripeComplete);

        return (
            <form onSubmit={(e) => this.handleSubmit(e, allValid)}>
                <h3>Personal details</h3>
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

                <h3>Shipping address</h3>
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
                        <label className='text-field--label' for='address'>address first line</label>
                    </div>
                    {addressFirstError && <p className="error-message">{addressFirstError}</p>}
                </div>
                <div className='text-field--container'>
                    <div className='text-field'>
                        <input
                            className='text-field--input'
                            name="addressSecondLine"
                            id="addressSecondLine"
                            placeholder=' '
                            type='text'
                            onBlur={(e) => this.handleInput(e)}
                        />
                        <label className='text-field--label' for='address'>address second line</label>
                    </div>
                    {addressSecondError && <p className="error-message">{addressSecondError}</p>}
                </div>
                <div className='text-field--container'>
                    <div className='text-field'>
                        <input
                            className='text-field--input'
                            name="addressThirdLine"
                            id="addressThirdLine"
                            placeholder=' '
                            type='text'
                            onBlur={(e) => this.handleInput(e)}
                        />
                        <label className='text-field--label' for='address'>address third line</label>
                    </div>
                    {addressThirdError && <p className="error-message">{addressThirdError}</p>}
                </div>
                <div className='text-field--container'>
                    <div className='text-field'>
                        <input
                            className='text-field--input'
                            name="city"
                            id="city"
                            placeholder=' '
                            type='text'
                            onBlur={(e) => this.handleInput(e)}
                        />
                        <label className='text-field--label' for='city'>city</label>
                    </div>
                    {cityError && <p className="error-message">{cityError}</p>}
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

                <h3 style={{ marginTop: '12px' }}>Payment details</h3>
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