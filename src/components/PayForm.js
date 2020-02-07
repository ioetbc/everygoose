import React, { Component, Fragment } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';

import handleValidationMessage from './utils/handleValidationMessage';
import capturePaypalPayment from './utils/capturePaypalPayment';

import PersonalInfo from './form/PersonalInfo';
import ShippingInfo from './form/ShippingInfo';
import handleOrder from './utils/handleOrder';
import loadingState from './utils/LoadingState';

class PayForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stripeComplete: false,
            firstName: 'wiil',
            lastName: 'sqsq',
            email: 'ioetbc@gmail.com',
            basket: this.props.basket,
            addressFirstLine: 'grgrgrgrgr',
            addressSecondLine: '',
            addressThirdLine: '',
            city: 'winchester',
            county: 'fefef',
            country: ['Spain'],
            postcode: 'so238ba',
            phone: '07493774943',     
            isLoading: false,
            paymentMethod: 'stripe',
            // stripeComplete: false,
            // firstName: undefined,
            // lastName: undefined,
            // email: undefined,
            // basket: this.props.basket,
            // addressFirstLine: undefined,
            // addressSecondLine: undefined,
            // addressThirdLine: undefined,
            // city: undefined,
            // county: undefined,
            // country: [],
            // postcode: undefined,
            // phone: undefined,     
            // isLoading: false,
            // paymentMethod: undefined,
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

    componentWillUnmount() {
        const loadingState = document.getElementsByClassName('is-loading')[0];
        const loadingSpinner = document.getElementsByClassName('loading-spinner')[0];
    
        if (loadingState && loadingSpinner) {
            loadingState.remove();
            loadingSpinner.remove();
        }
    }

    async handleStripePayment() {
        if (this.state.stripeComplete) {
            loadingState();
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
        const { stripeComplete } = this.state;
        const hasErrors = [...document.getElementsByClassName('error-message')].length > 0;
        let formFilledIn = false;

        if (
            this.state.firstName !== undefined &&
            this.state.lastName !== undefined &&
            this.state.email !== undefined &&
            this.state.basket.length > 0 &&
            this.state.addressFirstLine !== undefined &&
            this.state.city !== undefined &&
            this.state.county !== undefined &&
            this.state.country.length > 0 &&
            this.state.postcode !== undefined &&
            this.state.phone !== undefined
        ) formFilledIn = true;

		const showBuyNowButton = this.state.paymentMethod === 'stripe' && formFilledIn && !hasErrors && stripeComplete;

		const rednerShippingQuestions =
			this.state.firstName !== undefined &&
			this.state.firstName !== undefined &&
			this.state.lastName !== undefined &&
			this.state.lastName !== undefined &&
			this.state.email !== undefined &&
			this.state.email !== undefined &&
            this.state.phone !== undefined

		const renderPaymentQuestions = formFilledIn && !hasErrors;
		let showFakeButton = true;
	
		if (this.state.paymentMethod === 'paypal' || this.state.stripeComplete) {
			showFakeButton = false;
        }

        return (
            <form onSubmit={(e) => {
                e.preventDefault()
                this.handleStripePayment()
                document.getElementById('submitButton').setAttribute('disabled', 'disabled');
            }}>

                <PersonalInfo
                    onBlur={(e) => {
                        const value = handleValidationMessage(e)
                        const key = e.target.name;
                        this.setState({ [key]: value })
					}}
                />

                <ShippingInfo
                    onBlur={(e) => {
                        const value = handleValidationMessage(e)
                        const key = e.target.name;
                        this.setState({ [key]: value });
                    }}
                    rednerShippingQuestions={rednerShippingQuestions}
                    handleCountry={this.props.handleCountry}
                />

                {renderPaymentQuestions ?
					<Fragment>
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
					</Fragment>
					:
					<div className="question-lock-up" style={{ marginTop: '24px' }}>
						<h3>Payment details</h3>
					</div>
				}
				{showFakeButton &&
					<button className="button fake">pay now</button>
				} 
            </form>
        );
    }
}

export default injectStripe(PayForm);