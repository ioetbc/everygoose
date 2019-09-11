import React, { Component } from 'react';
import { uniq } from 'lodash';
import { Link } from 'react-router-dom';

import Logo from '../images/misc/logo.svg';
import Hamburger from '../images/misc/hamburger.svg';


class Navigation extends Component {
    constructor() {
        super()
        this.state = { show: false, bottom: false }
        this.showMobileMenu = this.showMobileMenu.bind(this);
    }

    showMobileMenu() {
        this.setState({ show: !this.state.show }) 
    }

    render() {
        const { navigationItems, handleNavigationFilter, shop } = this.props;
        return (
            <div className="navigation">
                <div className="sticky">
                    <Link to={{ pathname: "/" }}>
                        <img className="navigation-logo" src={Logo} alt="EveryGoose logo" />                
                    </Link>
                    <div className="menu" onClick={this.showMobileMenu}>
                        <img className="hamburger-icon" src={Hamburger} alt="" />
                    </div>
                    <nav style={{ paddingLeft: shop && '-70px' }} className={`navigation-items ${this.state.show && 'hello'}`} >
                        <div className="hide-shop-mobile">
                            <Link to={{ pathname: "/" }}><h4>shop</h4></Link>
                            {shop &&
                                <ul>
                                    {uniq(navigationItems).map(navItem =>
                                        <li onClick={() => handleNavigationFilter(navItem)}>- {navItem}</li>
                                    )}
                                    <li onClick={() => handleNavigationFilter('reset')}>reset</li>
                                </ul>
                            }
                        </div>
                        <Link to={{ pathname: "/about" }}><h4>about</h4></Link>
                        <Link to={{ pathname: "/trade" }}><h4>trade</h4></Link>
                        <h4>work</h4>
                        <Link to={{ pathname: "/contact" }}><h4>contact</h4></Link>
                    </nav>
                    <div className="navigation-basket"></div>
                </div>
                <div
                    id="shit"
                    className="social-items"
                >
                    <div className="social-link"></div>
                    <div className="social-link"></div>
                </div>
            </div>
        )
    }
};

export default Navigation;
