import React, { Component } from 'react';
import Logo from '../images/misc/logo.svg';
import Hamburger from '../images/misc/hamburger.svg';


class Navigation extends Component {
    constructor() {
        super()
        this.state = { show: false }
        this.showMobileMenu = this.showMobileMenu.bind(this);
    }

    showMobileMenu() {
        this.setState({ show: !this.state.show }) 
    }

    render() {
        return (
            <div className="navigation">
                <div className="sticky">
                    <img className="navigation-logo" src={Logo} alt="EveryGoose logo" />
                    <div className="menu" onClick={this.showMobileMenu}>
                        <img className="hamburger-icon" src={Hamburger} alt="" />
                    </div>
                    <nav className={`navigation-items ${this.state.show && 'hello'}`} >
                        <h4>shop</h4>
                        <ul>
                            <li>card</li>
                            <li>card</li>
                            <li>card</li>
                            <li>card</li>
                            <li>card</li>
                            <li>card</li>
                        </ul>
                        <h4>about</h4>
                        <h4>contact</h4>
                    </nav>
                    <div className="navigation-basket"></div>
                </div>
                <div className="social-items">
                    <div className="social-link"></div>
                    <div className="social-link"></div>
                    <div className="social-link"></div>
                </div>
            </div>
        )
    }
};

export default Navigation;
