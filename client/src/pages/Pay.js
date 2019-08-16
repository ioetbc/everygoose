import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';

import Overview from '../components/Overview';
import PayForm from '../components/PayForm'

const Product = ({ location }) => {
    const deliveryCost = 2;
    return (
        <main className="main-content">
            <div className="slide-show-side-by-side">
                <StripeProvider apiKey={process.env.REACT_APP_STRIPE_PUBLISHABLE}>
                    <Elements>
                        <PayForm
                            basket={location.state.basket}
                            deliveryCost={deliveryCost}
                        />
                    </Elements>
                </StripeProvider>
                <Overview
                    basket={location.state.basket}
                    payPage
                    deliveryCost={deliveryCost}
                />
            </div>
        </main>
    );
}

export default Product;