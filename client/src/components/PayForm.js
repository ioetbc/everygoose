import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';

import getEstimatedDelivery from './utils/EstimateDelivery';
import { PaySchema } from '../schema/PaySchema';

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
            paymentMethod: 'visa',
            paymentValues: {},
            validationError: ''
        }

        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    async handleSubmit(e) {
        e.preventDefault();

        const { error } = PaySchema.validate(this.state.paymentValues);
            if (error) {
                console.log('pay validation error', error)
                this.setState({ validationError: error.message });
                return error;
            }
            try {
                const {
                    firstName,
                    lastName,
                    addressFirstLine,
                    county,
                    postcode,
                    email,
                    phone,
                    paymentValues,
                } = this.state;

                const { basket } = this.props;
    
                const { token } = await this.props.stripe.createToken({ name: this.state.FirstName })
                const quantity = basket.reduce((a, item) => parseInt(item.quantity, 10) + a, 0);
                const estimatedDelivery = getEstimatedDelivery();


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
                        county,
                        token,
                        email,
                        phone,
                        paymentValues,
                        basket,
                    }),
                });

            } catch(error) {
                console.log('payment error', error)
                return error;
            }
    }

    handleInput = (e) => {
        e.preventDefault();
        this.setState({
            paymentValues: {...this.state.paymentValues, [e.target.name]: e.target.value },
        })
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>

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
                    </div>
                </div>

                {!!this.state.validationError &&
                    <p className='error-message'>{(this.state.validationError).toString()}</p>
                }

                <h3 style={{ marginTop: '12px' }}>payment method</h3>

                <CardElement
                    hidePostalCode
                />
                <button
                    className='button pay-form'
                >
                    pay now
                </button>
            </form>
        );
    }
}

export default injectStripe(PayForm);