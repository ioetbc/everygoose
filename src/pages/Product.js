import React, { Fragment } from 'react';

import ScrollToTop from '../components/utils/ScrollTop';
import SlideShow from '../components/SlideShow';
import ProductDetails from '../components/ProductDetails';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import PortraitInside from '../images/portrait-inside.jpg';
import PortraitEnvelope from '../images/evnvelope.jpg';
import SquareInside from '../images/square-inside.jpg';
import ImageBackLandscape from '../images/envelope-square.jpg';

const Product = ({ location, history }) => {
    if (!location.state) {
        history.push("/", null);
        return null;
    } else {
        const { item } = location.state

        let slideshowImages;
        if (item) {
            slideshowImages = [item.image_1_url];
    
            const cardWidth = get(item, 'card_dimensions.width', 10.5)
            const cardHeight = get(item, 'card_dimensions.height', 14.8);
    
            console.log('cardWidth', cardWidth);
    
            if (cardWidth === 10.5 && cardHeight === 14.8) slideshowImages.push(PortraitInside, PortraitEnvelope);
        }
    
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
}

export default Product;