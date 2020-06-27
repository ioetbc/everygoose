import React, { Fragment } from 'react';

import ScrollToTop from '../components/utils/ScrollTop';
import SlideShow from '../components/SlideShow';
import ProductDetails from '../components/ProductDetails';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import PortraitInside from '../images/cards/card-portrait-inside.jpg';
import LandscapeInside from '../images/cards/card-landscape-inside.jpg';
import PortraitLandscapeEnvelope from '../images/cards/card-landscape-envelope.jpg';
import SquareInside from '../images/cards/card-square-inside.jpg';
import SquareEnvelope from '../images/cards/card-square-envelope.jpg';

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

            if (cardWidth === 10.5 && cardHeight === 14.8) slideshowImages.push(PortraitInside, PortraitLandscapeEnvelope);
            if (cardWidth === 14.8 && cardHeight === 10.5) slideshowImages.push(LandscapeInside, PortraitLandscapeEnvelope);
            if (cardWidth === 14.8 && cardHeight === 14.8) slideshowImages.push(SquareInside, SquareEnvelope);
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
                    <p>No items selected, <Link to={{ pathname: "/"}}>back to shop</Link></p>
                </main>
            )
        }
    }
}

export default Product;