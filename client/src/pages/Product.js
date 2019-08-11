import React from 'react';

import SlideShow from '../components/SlideShow';
import ProductDetails from '../components/ProductDetails';

const Product = ({ location, addToBasket, basket }) => {
    return (
        <main className="main-content">
            <div className="slide-show-side-by-side">
                <SlideShow />
                <ProductDetails
                    details={location.state.details}
                    addToBasket={addToBasket}
                />
            </div>
        </main>
    );
}

export default Product;