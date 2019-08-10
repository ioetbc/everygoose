import React from 'react';

export default function Header({ title, basket, shop  }) {
    return (
        <div className={`header ${shop && 'shop'}`}>
            <h1 className="header-title">{title}</h1>
            <p className="header-basket">
                basket ({basket && basket.length})
            </p>
        </div>
    )
}
