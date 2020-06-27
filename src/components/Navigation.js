import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Headroom from 'headroom.js'

import Logo from '../images/misc/logo-animated.gif';
import Hamburger from '../images/misc/hamburger.svg';
import Chevron from '../images/misc/chevron.svg'

import getBasket from './utils/getBasket';

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = { showMobileMenu: false, showMoreCategories: false }
    }

    componentDidUpdate() {
        if (this.props.shop) {
            const banner = document.getElementById("headroom");
            if (banner) {
                const headroom  = new Headroom(banner);
                headroom.init();
            }
        }
    }

    render() {
        const { navigationItems, handleNavigationFilter, shop, classModifier } = this.props;
        const { showMoreCategories } = this.state;
        const basket = getBasket();
        const categoryWrapperHeight = navigationItems.length * 45;

        return (
            <Fragment>
                {shop &&
                    <div className="free-delivery-banner mobile" id="headroom">
                        <p>free delivery on UK orders over £35</p>
                    </div>
                }
                <div className={`navigation ${classModifier}`}>
                <div className="sticky">
                    <Link to={{ pathname: "/" }}>
                        <img className="navigation-logo" src={Logo} alt="EveryGoose logo" />                
                    </Link>
                    <div
                        onClick={() => this.setState({ showMobileMenu: !this.state.showMobileMenu })}
                        className="menu basket-wrapper mobile"
                    >
                        <img className="basket-icon" src={Hamburger}></img>                    
                    </div>
                    <nav style={{ paddingLeft: shop && '-70px' }} className={`navigation-items ${this.state.showMobileMenu && 'show-mobile-menu'}`} >
                        <div className="hide-shop-mobile">
                            <Link to={{ pathname: "/" }}><h4>shop</h4></Link>
                            {shop &&
                                <React.Fragment>
                                    <div className="category-wrapper" style={{ maxHeight: !!showMoreCategories ? categoryWrapperHeight : '220px' }}>
                                        <ul>
                                            {navigationItems.map((navItem, index) =>
                                                <li key={index} onClick={() => handleNavigationFilter(navItem)}>{navItem}</li>
                                            )}
                                        </ul>
                                    </div>
                                    <button
                                        onClick={() => this.setState({ showMoreCategories: !this.state.showMoreCategories })}
                                        className="show-more-categories"
                                    >
                                        <p>{showMoreCategories ? 'SHOW LESS' : 'SHOW MORE'}</p>
                                        <img
                                            className="chevron"
                                            src={Chevron}
                                            style={{ transform: showMoreCategories ? '' : 'scale(-1)', marginTop: showMoreCategories ? '' : '-5px' }}
                                        />
                                    </button>
                                </React.Fragment>
                            }
                        </div>
                        <Link className="mobile-only" to={{ pathname: "/" }}><h4>home</h4></Link>
                        <Link to={{ pathname: "/about" }}><h4>about</h4></Link>
                        <Link to={{ pathname: "/weddings" }}><h4>weddings</h4></Link>
                        <Link to={{ pathname: "/murals" }}><h4>Windows & Murals</h4></Link>
                        <Link to={{ pathname: "/trade" }}><h4>trade</h4></Link>
                        <Link to={{ pathname: "/contact" }}><h4>contact</h4></Link>
                        <Link to={{ pathname: "/checkout" }}>
                            <h4 className="hide-desktop">basket ({basket.length > 0 && basket.length})</h4>
                        </Link>
                    </nav>
                    <div className="social-items">
                        <div
                            onClick={() => window.open('http://www.instagram.com/everygoose/', '_blank')}
                            className="social-link"
                        >
                        </div>

                        <div
                            onClick={() => window.open('http://www.facebook.com/Every-Goose-368589263977587/', '_blank')}
                            className="social-link"
                        >
                        </div>

                        <div
                            onClick={() => window.open('https://www.etsy.com/uk/shop/EveryGoose', '_blank')}
                            className="social-link"
                        >
                        </div>
                    </div>
                </div>
            </div>
            </Fragment>
        )
    }
};

export default Navigation;
