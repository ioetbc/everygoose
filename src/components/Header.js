import React from 'react';
import Basket from '../images/misc/basket.svg'

export default function Header(props) {
    return (
        <div className="header">
            <h1 className="header-title">{props.title}</h1>
            <p className="header-basket">
                basket
            </p>
        </div>
    )
}
