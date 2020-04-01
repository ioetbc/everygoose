import React, { Component } from 'react';
import { uniq } from 'lodash';
import { Link } from 'react-router-dom';

import Logo from '../images/misc/logo.svg';
import Hamburger from '../images/misc/hamburger.svg';
import Chevron from '../images/misc/chevron.svg'

import getBasket from './utils/getBasket';

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = { showMobileMenu: false, showMoreCategories: false }
    }

    render() {
        const { navigationItems, handleNavigationFilter, shop, classModifier } = this.props;
        const { showMoreCategories } = this.state;
        navigationItems.unshift('all');
        const basket = getBasket();
        const uniqueCategories = uniq(navigationItems);

        const flipChevron = showMoreCategories ? '' : `transform: scale(-1), marginTop: '-5px;'`

        console.log('uniqueCategories.lenght', uniqueCategories.length);

        const categoryWrapperHeight = uniqueCategories.length * 45;

        console.log('categoryWrapperHeight', categoryWrapperHeight)

        return (
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
                                            {uniqueCategories.map((navItem, index) =>
                                                <li key={index} onClick={() => handleNavigationFilter(navItem)}>{navItem}</li>
                                            )}
                                        </ul>
                                    </div>
                                    <button
                                        onClick={() => this.setState({ showMoreCategories: !this.state.showMoreCategories })}                 className="show-more-categories"
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
                        <Link to={{ pathname: "/about" }}><h4>about</h4></Link>
                        <Link to={{ pathname: "/trade" }}><h4>trade</h4></Link>
                        <Link to={{ pathname: "/contact" }}><h4>contact</h4></Link>
                        <Link to={{ pathname: "/checkout" }}>
                            <h4 className="hide-desktop">basket ({basket.length > 0 && basket.length})</h4>
                        </Link>
                    </nav>
                </div>
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
        )
    }
};

export default Navigation;
