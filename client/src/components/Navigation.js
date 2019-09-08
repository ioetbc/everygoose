import React, { Component } from 'react';
import { uniq } from 'lodash';

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
        const { navigationItems, handleNavigationFilter } = this.props;
        return (
            <div className="navigation">
                <div className="sticky">
                    <img className="navigation-logo" src={Logo} alt="EveryGoose logo" />
                    <div className="menu" onClick={this.showMobileMenu}>
                        <img className="hamburger-icon" src={Hamburger} alt="" />
                    </div>
                    <nav className={`navigation-items ${this.state.show && 'hello'}`} >
                        <div className="hide-shop-mobile">
                            <h4>shop</h4>
                            <ul>
                                {uniq(navigationItems).map(navItem =>
                                    <li onClick={() => handleNavigationFilter(navItem)}>- {navItem}</li>
                                )}
                                <li onClick={() => handleNavigationFilter('reset')}>reset</li>
                            </ul>
                        </div>
                        <h4>about</h4>
                        <h4>trade</h4>
                        <h4>work</h4>
                        <h4>contact</h4>
                    </nav>
                    <div className="navigation-basket"></div>
                </div>
                <div
                    id="shit"
                    className="social-items"
                    // style={{ position: 'fixed', bottom: `${!!this.state.bottom ? '120px' : '0px'}` }}
                >
                    <div className="social-link"></div>
                    <div className="social-link"></div>
                    <div className="social-link"></div>
                </div>
            </div>
        )
    }
};

export default Navigation;
