import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';

class SlideShow extends Component {
    render() {
        return (
            <div className="slide-container">
                <Carousel
                    showIndicators={false}
                    showStatus={false}
                    showArrows={false}
                    autoPlay={true}
                >
                    {this.props.slideshowImages.map((item, key) => 
                        <img
                            className="placeholder-slideshow-item"
                            src={item}
                        />
                    )}
                </Carousel>
            </div>
        );
    }
}

export default SlideShow;