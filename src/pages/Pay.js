import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { Link } from 'react-router-dom';

import ScrollToTop from '../components/utils/ScrollTop';
import Overview from '../components/Overview';
import PayForm from '../components/PayForm'

const Product = ({ location }) => {

    if (location.state) {
        return [
            <ScrollToTop />,
            <main className="main-content">
                <div className="checkout-not-equal">
                    <StripeProvider apiKey={process.env.REACT_APP_STRIPE_PUBLISHABLE}>
                        <Elements>
                            <PayForm
                                basket={location.state.basket}
                            />
                            </Elements>
                    </StripeProvider>
                    <Overview
                        basket={location.state.basket}
                        payPage
                    />
                </div>
            </main>,
        ]; 
    } else {
        return (
            <main className="main-content">
                <p>No items selected, <Link to={{ pathname: "/"}}>back to homepage</Link></p>        
            </main>
        )
    }
}

export default Product;