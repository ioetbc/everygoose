import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios';
import uuid from 'uuid/v4';

import estimatedDelivery from './utils/EstimatedDelivery';
import validateSingle from './utils/validateSingle';

class PayForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stripeComplete: false,
            firstName: '',
            lastName: '',
            email: '',
            basket: [],
            addressSecond: '',
            addressFirst: '',
            addressSecondError: false,
            addressThirdError : false,
            city: '',
            county: '',
            postcode: '',
            phoneNumber: '',
            isLoading: false,
        }

        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(e, allValid) {
        if (allValid && this.state.stripeComplete) {
            this.setState({ isLoading: true });
            const inputs = [...document.getElementsByTagName('input')]
            inputs.map(i => i.value = '');
            const { token } = await this.props.stripe.createToken({ name: this.state.email });
            const cardOrCards = this.props.basket.length > 1 ? 'cards' : 'card';
            const breakdown = this.props.basket.map(a => {
                return {
                    quantity: a.quantity,
                    title: a.title,
                }});

            const quantity = parseInt(this.props.basket.map(i => i.quantity)[0], 10);
    
            let theyOrIt;
            if (quantity < 2 && this.props.basket.length === 1) {
                theyOrIt = 'It'
            } else {
                theyOrIt = 'They'; 
            }
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
                    breakdown,
                },
            })
            .then((res) => {
                this.setState({ isLoading: false });
               return  window.location=`${res.data}`
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                return window.location=`${error.data}`
            });
        }
    }

    handleInput(e) {
        e.preventDefault();
        const validate = validateSingle(e)
        if (validate.error) {
            const erroredInput = document.getElementsByName(e.taget.name)[0].tagName;
            console.log('errrr', erroredInput);
        }
    }

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
            isLoading,
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

        const disableButton = (allValid && stripeComplete);

        return [
            isLoading && <div className="is-loading"><div /></div>,
            <form onSubmit={(e) => {
                e.preventDefault()
                this.handleSubmit(e, allValid)
                document.getElementById('submitButton').setAttribute('disabled', 'disabled');
            }}>
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
                            <label className='text-field--label' for='firstName'>First name</label>
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
                            <label className='text-field--label' for='lastName'>Last name</label>
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
                            <label className='text-field--label' for='email'>Email</label>
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
                        <label className='text-field--label' for='phone'>Phone number</label>
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
                        <label className='text-field--label' for='address'>Address first line</label>
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
                        <label className='text-field--label' for='address'>Address second line</label>
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
                        <label className='text-field--label' for='address'>Address third line</label>
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
                        <label className='text-field--label' for='city'>City</label>
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
                            <label className='text-field--label' for='county'>County</label>
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
                            <label className='text-field--label' for='postcode'>Postcode</label>
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
                    id='submitButton'
                >
                    pay now
                </button>
            </form>,
        ];
    }
}

export default injectStripe(PayForm);