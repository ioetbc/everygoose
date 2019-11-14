import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios';
import uuid from 'uuid/v4';

import estimatedDelivery from './utils/EstimatedDelivery';
import handleValidationMessage from './utils/handleValidationMessage';

import PersonalInfo from './form/PersonalInfo';
import ShippingInfo from './form/ShippingInfo';

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
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(e) {
        if (this.state.stripeComplete) {
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

    render() {
        const {
            stripeComplete,
            isLoading,
        } = this.state;

        const hasErrors = [...document.getElementsByClassName('error-message')].length > 0;

        return [
            isLoading && <div className="is-loading"><div /></div>,
            <form onSubmit={(e) => {
                e.preventDefault()
                this.handleSubmit(e)
                // TODO at this to the button onClick
                document.getElementById('submitButton').setAttribute('disabled', 'disabled');
            }}>

                <PersonalInfo
                    onBlur={(e) => handleValidationMessage(e)}
                />

                <h3>Shipping address</h3>

                <ShippingInfo
                    onBlur={(e) => handleValidationMessage(e)}
                    handleCountry={this.props.handleCountry}
                />

                <h3 style={{ marginTop: '12px' }}>Payment details</h3>

                <CardElement
                    hidePostalCode
                    onChange={(e) => this.setState({ stripeComplete: e.complete })}
                />

                <button
                    type="submit"
                    className={`button`}
                    id='submitButton'
                    // onClick={() => }
                >
                    pay now
                </button>

            </form>,
        ];
    }
}

export default injectStripe(PayForm);