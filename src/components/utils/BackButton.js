import React from 'react';

import BackIcon from '../../images/misc/back-button.svg';

const BackButton = ({ title, link }) => {
    return (
        <div
            className="back-button"
            onClick={() => window.location=`${link}`}
        >
            <img src={BackIcon} alt="" />
            <p className="back-button-text">{`${title}`}</p>
        </div>
    );
};

export default BackButton;