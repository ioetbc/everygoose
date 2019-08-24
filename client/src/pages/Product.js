import React from 'react';

import SlideShow from '../components/SlideShow';
import ProductDetails from '../components/ProductDetails';

const Product = ({ location, addToBasket, basket }) => {
    const { item } = location.state;

    const slideshowImages = [item.image_1_url, item.image_2_url, item.image_3_url];

    return (
        <main className="main-content">
            <div className="slide-show-side-by-side">
                <SlideShow
                    slideshowImages={slideshowImages}
                />
                <ProductDetails
                    details={location.state.item}
                    addToBasket={addToBasket}
                />
            </div>
        </main>
    );
}

export default Product;