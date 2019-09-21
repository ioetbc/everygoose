import React from 'react';

import Logo from '../images/icons/logo-white.svg';

const Footer = () => {
    return (
        <footer className="footer" id="footer">
            <img style={{ cursor: 'pointer' }} onClick={() => window.location='/'} className="footer-logo" src={Logo} alt="EveryGoose logo" />
            <div className="footer-items">
                <ul>
                    <li onClick={() => window.location='/contact'}>Contact</li>
                    <li onClick={() => window.location='/delivery'}>Delivery & returns</li>
                    <li onClick={() => window.location='/terms'}>Terms and conditions</li>
                </ul>
            </div>
        </footer>
    )
};

export default Footer;
