import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
// import blowUp from './utils/Blowup.js'

class SlideShow extends Component {
    componentDidMount() {
        (() => {
            // ========= SETTINGS ==========
            const SIZE = 100;
            const ZOOM = 2;
            const TOUCH_OFFSET = -100;
            
            // ========== VARS =============
            const frameElement = document.querySelector('.frame');
            const frameZoomElement = document.querySelector('.frame__zoom');
            
            // ========== FUNCS ============
            const attachMultipleEvents = (element, evs, handler) => {
              (Array.isArray(evs) ? evs : [evs]).forEach(
                ev => element.addEventListener(ev, handler));
            }
            
            const moveHandler = (x, y) => {
              frameZoomElement.style.clipPath = `circle(${SIZE / ZOOM}px at ${x}px ${y}px)`;
              frameZoomElement.style.transform = `translate(-${x * (ZOOM - 1)}px, -${y * (ZOOM - 1)}px) scale(${ZOOM})`;
            }
            
            const eventObjectToPosition = (e, relElement) => {
              return e.touches && e.touches.length > 0 ? {
                x: e.touches[0].clientX - relElement.offsetLeft + TOUCH_OFFSET,
                y: e.touches[0].clientY - relElement.offsetTop + TOUCH_OFFSET
              } : {
                x: e.offsetX,
                y: e.offsetY
              }
            }
            
            // ======= EVENT HANDLERS ======
            attachMultipleEvents(frameElement, ['mousemove', 'touchmove'], ev => {
              ev.preventDefault();
              
              const { x, y} = eventObjectToPosition(ev, frameElement);
              moveHandler(x, y);
            });
            
            attachMultipleEvents(frameElement, [ 'mouseenter', 'touchstart' ], ev => {
              ev.preventDefault();
              
              frameZoomElement.style.display = 'initial';
              
              const { x, y} = eventObjectToPosition(ev, frameElement);
              moveHandler(x, y);
            });
            
            attachMultipleEvents(frameElement, [ 'mouseleave', 'touchend' ], ev => {
              frameZoomElement.style.display = 'none';
            });
          })();
    }
    render() {
        return (
            <div className="slide-container">
                <Carousel
                    showIndicators={false}
                    showStatus={false}
                    showArrows={false}
                    autoPlay={true}
                >
                    {this.props.slideshowImages.map((item, index) =>        
                        <div class="frame">
                            <img
                                className="frame__pic placeholder-slideshow-item"
                                src={item}
                            />,
                            <img
                                className="frame__zoom"
                                src={item}
                            />
                        </div>
                    )}
                </Carousel>
            </div>
        );
    }
}

export default SlideShow;