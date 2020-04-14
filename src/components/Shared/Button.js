import React from 'react';

const Button = ({ text, onClick }) => {
    return (
        <button className="button" onClick={() => onClick && onClick()}>
            <p>{text}</p>
        </button>
    );
}

export default Button;