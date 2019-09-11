import React from 'react';
import Logo from '../images/icons/logo-white.svg';

const Footer = ({ isDesktop }) => {
    return (
        <footer className="footer" id="footer">
            <img className="footer-logo" src={Logo} alt="EveryGoose logo" />
            <div className="footer-items">
                <ul>
                    <li>Contact</li>
                    <li>Delivery & returns</li>
                    <li>Terms and conditions</li>
                </ul>
            </div>
        </footer>
    )
};

export default Footer;
