import React, { Component, Fragment } from 'react';
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
            stripeComplete: false,
            firstName: '',
            lastName: '',
            email: '',
            basket: this.props.basket,
            addressFirstLine: '',
            addressSecondLine: '',
            addressThirdLine: '',
            city: '',
            county: '',
            country: [],
            postcode: '',
            phone: '',     
            isLoading: false,
            paymentMethod: '',
        }
		this.handleStripePayment = this.handleStripePayment.bind(this);
    }

    componentDidUpdate(undefined, prevState) {
        if (prevState.paymentMethod !== this.state.paymentMethod) {
            const data = {
                ...this.state,
                subTotal: this.props.subTotal,
                europeanCountries: this.props.europeanCountries,
            }
            capturePaypalPayment(data);
        }
    };

    async handleStripePayment() {
        if (this.state.stripeComplete) {
            this.setState({ isLoading: true });
            const { token } = await this.props.stripe.createToken({ name: this.state.email });
            const payload = {
                ...this.state,
                subTotal: this.props.subTotal,
                stripeToken: token.id,
                europeanCountries: this.props.europeanCountries,
            }
            const approveOrder = await handleOrder(payload, 'stripe');
            if (approveOrder.status === 200) {
                window.location='/#/done';
            } else {
				window.location='/#/sorry';
			}
        }
    };

    render() {
        const {
            stripeComplete,
            isLoading,
        } = this.state;

        const hasErrors = [...document.getElementsByClassName('error-message')].length > 0;

        let formFilledIn = false;

        if (
            this.state.firstName !== '' &&
            this.state.lastName !== '' &&
            this.state.email !== '' &&
            this.state.basket.length > 0 &&
            this.state.addressFirstLine !== '' &&
            this.state.city !== '' &&
            this.state.county !== '' &&
            this.state.country !== '' &&
            this.state.postcode !== '' &&
            this.state.phone !== ''
        ) formFilledIn = true;

        const showBuyNowButton = this.state.paymentMethod === 'stripe' && formFilledIn && !hasErrors && this.state.stripeComplete;

        return [
            isLoading && <div className="is-loading"><div /></div>,
            <form onSubmit={(e) => {
                e.preventDefault()
                this.handleStripePayment()
                // TODO at this to the button onClick
                document.getElementById('submitButton').setAttribute('disabled', 'disabled');
            }}>

                <PersonalInfo
                    onBlur={(e) => {
                        const value = handleValidationMessage(e)
                        const key = e.target.name;
                        this.setState({ [key]: value })
                    }}
                />

                <h3>Shipping address</h3>

                <ShippingInfo
                    onBlur={(e) => {
                        const value = handleValidationMessage(e)
                        const key = e.target.name;
                        this.setState({ [key]: value });
                    }}
                    handleCountry={this.props.handleCountry}
                />

                {formFilledIn && !hasErrors &&
                    <div>
                    <h3 style={{ marginTop: '12px' }}>Payment details</h3>

                    <div className="payment-method-container">
                        <div
                            onClick={() => {
                                this.setState({ paymentMethod: 'stripe' })
                            }}
                            className="payment-method"
                            style={{ background: this.state.paymentMethod === 'stripe' && 'white' }}
                        >
                            <p>credit / debit card</p>
                        </div>
                        <div
                            onClick={() => {
                                formFilledIn = false
                                this.setState({
                                    paymentMethod: 'paypal',
                                })}
                            }
                            className="payment-method"
                            style={{ background: this.state.paymentMethod === 'paypal' && 'white' }}
                        >
                            <p>paypal</p>
                        </div>
                    </div>

                    {this.state.paymentMethod === 'stripe' &&
                        <Fragment>
                            <CardElement
                                hidePostalCode
                                onChange={(e) => this.setState({ stripeComplete: e.complete})}
                            />
                            {showBuyNowButton &&
                            <button
                                type="submit"
                                className={`button`}
                                id='submitButton'
                            >
                                pay now
                            </button>
                            }
                        </Fragment>
                    }

                    {this.state.paymentMethod === 'paypal' && 
                        <div id="paypal-button-container"></div>
                    }
                 
                    </div>
                }
            </form>,
        ];
    }
}

export default injectStripe(PayForm);