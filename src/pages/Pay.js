import React from 'react';

import SlideShow from '../components/SlideShow';
import Overview from '../components/Overview';

const Product = ({ location, addToBasket, basket }) => {
    return (
        <main className="main-content">
            <div className="slide-show-side-by-side">
                <SlideShow />
                <Overview
                    basket={location.state.basket}
                    payPage
                />
            </div>
        </main>
    );
}

export default Product;