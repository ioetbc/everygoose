import React, { Fragment } from 'react';

import ScrollToTop from '../components/utils/ScrollTop';
import SlideShow from '../components/SlideShow';
import ProductDetails from '../components/ProductDetails';
import { Link } from 'react-router-dom';

const Product = ({ location, addToBasket, basket }) => {
    const lastItemAddedToBasket = !location.state && JSON.parse(localStorage.getItem('session')).slice(-1).pop();
    const prevItem = {
        item: {
            ...lastItemAddedToBasket,
        }
    };

    const { item } = location.state || prevItem;

    let slideshowImages;
    if (item) slideshowImages = [item.image_1_url, item.image_2_url, item.image_3_url];

    if (item) {
        return (
            <Fragment>
                <ScrollToTop />
                <main className="main-content">
                    <div className="slide-show-side-by-side">
                        <SlideShow
                            slideshowImages={slideshowImages}
                        />
                        <ProductDetails
                            product={item}
                            addToBasket={addToBasket}
                        />
                    </div>
                </main>
            </Fragment>
        )
    } else {
        return (
            <main className="main-content">
                <p>No items selected, <Link to={{ pathname: "/"}}>back to homepage</Link></p>
            </main>
        )
    }
}

export default Product;