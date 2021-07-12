import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import getDeliveryCharge from '../components/utils/deliveryCharge';
import getPrice from '../components/utils/getPrice';

import ScrollToTop from '../components/utils/ScrollTop';
import Overview from '../components/Overview';
import PayForm from '../components/PayForm';
import getBasket from '../components/utils/getBasket';

class Product extends Component {
  constructor(props) {
    const basket = getBasket();
    const total = getPrice(basket);
    const defaultDeliveryCharge = getDeliveryCharge(
      'United Kingdom',
      [{ name: 'United Kingdom' }],
      basket,
      total
    );
    super(props);
    this.state = {
      europeanCountries: [],
      deliveryCharge: defaultDeliveryCharge,
    };
    this.handleCountry = this.handleCountry.bind(this);
  }

  handleCountry(country) {
    const basket = getBasket();
    const total = getPrice(basket);
    const deliveryCharge = getDeliveryCharge(
      country,
      this.state.europeanCountries,
      basket,
      total
    );
    this.setState({ deliveryCharge });
  }

  render() {
    const basket = getBasket();
    const total = getPrice(basket);
    const subTotal = (parseFloat(total) + this.state.deliveryCharge).toFixed(2);

    if (basket) {
      return (
        <Fragment>
          <ScrollToTop />
          <main className="main-content">
            <div className="checkout-not-equal">
              <PayForm
                basket={basket}
                handleCountry={this.handleCountry}
                subTotal={subTotal}
                europeanCountries={this.state.europeanCountries}
              />
              <Overview
                basket={basket}
                payPage
                deliveryCharge={this.state.deliveryCharge.toFixed(2)}
                europeanCountries={this.state.europeanCountries}
                subTotal={subTotal}
              />
            </div>
          </main>
        </Fragment>
      );
    } else {
      return (
        <main className="main-content">
          <p>
            No items selected, <Link to={{ pathname: '/' }}>back to shop</Link>
          </p>
        </main>
      );
    }
  }
}

export default Product;
