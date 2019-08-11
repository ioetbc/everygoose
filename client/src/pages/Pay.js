import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';

import Overview from '../components/Overview';
import PayForm from '../components/PayForm'

const Product = ({ location, addToBasket, basket }) => {
    return (
        <main className="main-content">
            <div className="slide-show-side-by-side">
                <StripeProvider apiKey="">
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