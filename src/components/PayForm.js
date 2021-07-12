import React, { Component, Fragment } from 'react';

import handleValidationMessage from './utils/handleValidationMessage';

import PersonalInfo from './form/PersonalInfo';
import ShippingInfo from './form/ShippingInfo';
import loadingState from './utils/LoadingState';

class PayForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      basket: this.props.basket,
      addressFirstLine: undefined,
      addressSecondLine: undefined,
      addressThirdLine: undefined,
      city: undefined,
      county: undefined,
      country: [],
      postcode: undefined,
      phone: undefined,
      isLoading: false,
      paymentMethod: '',
      product_code: '',
    };
  }

  componentWillUnmount() {
    const loadingState = document.getElementsByClassName('is-loading')[0];
    const loadingSpinner = document.getElementsByClassName(
      'loading-spinner'
    )[0];

    if (loadingState && loadingSpinner) {
      loadingState.remove();
      loadingSpinner.remove();
    }
  }

  render() {
    const hasErrors =
      [...document.getElementsByClassName('error-message')].length > 0;
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
    )
      formFilledIn = true;

    const rednerShippingQuestions = false;

    const renderPaymentQuestions = formFilledIn && !hasErrors;
    let showFakeButton = true;

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          document
            .getElementById('submitButton')
            .setAttribute('disabled', 'disabled');
        }}
      >
        <PersonalInfo
          onBlur={(e) => {
            const value = handleValidationMessage(e);
            const key = e.target.name;
            this.setState({ [key]: value });
          }}
        />
        <ShippingInfo
          onBlur={(e) => {
            const value = handleValidationMessage(e);
            const key = e.target.name;
            this.setState({ [key]: value });
          }}
          rednerShippingQuestions={rednerShippingQuestions}
          handleCountry={this.props.handleCountry}
        />
        <div className="question-lock-up" style={{ marginTop: '24px' }}>
          <h3>Payment details</h3>
        </div>
        {showFakeButton && <button className="button fake">pay now</button>}
      </form>
    );
  }
}

export default PayForm;
