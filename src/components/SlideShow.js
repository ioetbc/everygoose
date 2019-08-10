import React from 'react';
import { Slide } from 'react-slideshow-image';
   
const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: false,
}

const slideShowImages = [1,2,3,4,5,6];

const SlideShow = () => {
    return (
        <div className="slide-container">
            <Slide {...properties}>
                {slideShowImages.map((item, key) => 
                    <div className="each-slide">
                        <div className="placeholder-slideshow-item"></div>
                    </div>
                )}
            </Slide>
        </div>
    );
}

export default SlideShow;