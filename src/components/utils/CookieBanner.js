
import React from 'react';

const CookieBanner = ({ handleConsent }) => {
    return (
        <div
            className="cookie-banner"
        >
            <p>By continuing to use this site, you agree to our <a href="#/terms" target="_blank">Cookie policy</a>.</p>
            <div className="cookie-button" onClick={() => handleConsent()}>
                <p>okay</p>
            </div>
        </div>
    )
}

export default CookieBanner;
