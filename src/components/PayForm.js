import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';

import handleValidationMessage from './utils/handleValidationMessage';
import capturePaypalPayment from './utils/capturePaypalPayment';

import PersonalInfo from './form/PersonalInfo';
import ShippingInfo from './form/ShippingInfo';
import handleOrder from './utils/handleOrder';

class PayForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stripeComplete: true,
            firstName: 'will',
            lastName: 'cole',
            email: 'ioetbc@gmail.com',
            basket: [],
            addressFirst: '50 parchmewnt',
            addressSecond: '34 parhment ster',
            addressSecondError: false,
            addressThirdError : false,
            city: 'winchester',
            county: 'hampshiert',
            postcode: 'so238ba',
            phoneNumber: '07493774943',     
            isLoading: false,
            paymentMethod: null,
        }
		this.handleStripePayment = this.handleStripePayment.bind(this);
    }

    componentDidUpdate(undefined, prevState) {
        if (prevState.paymentMethod !== this.state.paymentMethod) {
            const data = {
                ...this.state,
                subTotal: this.props.subTotal
            }
            capturePaypalPayment(data);
        }
    }

    async handleStripePayment() {
        console.log('in the handleopayment duncr')
        if (this.state.stripeComplete) {
            this.setState({ isLoading: true });
            const inputs = [...document.getElementsByTagName('input')]
            inputs.map(i => i.value = '');

            const { token } = await this.props.stripe.createToken({ name: this.state.email });
            const data = {
                ...this.state,
                subTotal: this.props.subTotal,
                stripeToken: token.id,
            }
            handleOrder(data, 'stripe');
        }
    };

    render() {
        const {
            stripeComplete,
            isLoading,
        } = this.state;

        const hasErrors = [...document.getElementsByClassName('error-message')].length > 0

        return [
            isLoading && <div className="is-loading"><div /></div>,
            <form onSubmit={(e) => {
                e.preventDefault()
                this.handleStripePayment()
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

                <div className="payment-method-container">
                    <div
                        onClick={() => this.setState({ paymentMethod: 'stripe' })}
                        className="payment-method"
                        style={{ background: this.state.paymentMethod === 'stripe' && 'white' }}
                    >
                        <p>credit / debit card</p>
                    </div>
                    <div
                        onClick={() => this.setState({ paymentMethod: 'paypal' })}
                        className="payment-method"
                        style={{ background: this.state.paymentMethod === 'paypal' && 'white' }}
                    >
                        <p>paypal</p>
                    </div>
                </div>

                {this.state.paymentMethod === 'stripe' &&
                    <CardElement
                        hidePostalCode
                        onChange={(e) => this.setState({ stripeComplete: e.complete })}
                    />
                }

                {this.state.paymentMethod === 'paypal' && 
                    <div id="paypal-button-container"></div>
                }

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