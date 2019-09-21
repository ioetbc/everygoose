import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios';

import EstimatedDelivery from './utils/EstimatedDelivery';
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
                phoneNumber: 'phoneNumber'
            },
        })
        .then(function (response) {
            console.log('the respoonse', response);
        })
        .catch(function (error) {
            console.log('the error', error);
        });
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


                <button className='button'>
                    pay now
                </button>
            </form>
        );
    }
}

export default injectStripe(PayForm);