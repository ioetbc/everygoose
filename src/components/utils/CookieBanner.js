
import React from 'react';

const CookieBanner = ({ handleConsent }) => {
    console.log('hell im here')
    return (
        <div
            className="cookie-banner"
        >
            <p>By continuing to use this site, you agree to our <a href="#/terms">Cookie policy</a>.</p>
            <div className="cookie-button" onClick={() => handleConsent()}>
                <p>okay</p>
            </div>
        </div>
    )
}

export default CookieBanner;
