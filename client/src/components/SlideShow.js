import React from 'react';
import { Slide } from 'react-slideshow-image';
   
const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: false,
}

const SlideShow = ({ slideshowImages }) => {
    return (
        <div className="slide-container">
            <Slide {...properties}>
                {slideshowImages.map((item, key) => 
                    <div className="each-slide">
                        <img className="placeholder-slideshow-item" src={item} />
                    </div>
                )}
            </Slide>
        </div>
    );
}

export default SlideShow;