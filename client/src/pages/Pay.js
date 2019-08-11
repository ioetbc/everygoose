import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';

import Overview from '../components/Overview';
import PayForm from '../components/PayForm'

const Product = ({ location }) => {
    return (
        <main className="main-content">
            <div className="slide-show-side-by-side">
                <StripeProvider apiKey={process.env.REACT_APP_STRIPE_PUBLISHABLE}>
                    <Elements>
                        <PayForm />
                    </Elements>
                </StripeProvider>
                <Overview
                    basket={location.state.basket}
                    payPage
                />
            </div>
        </main>
    );
}

export default Product;