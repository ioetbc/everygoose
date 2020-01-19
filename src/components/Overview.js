import React, { Fragment } from 'react';
import Button from './Shared/Button';
import { Link } from 'react-router-dom';
import getBasket from '../components/utils/getBasket';

import getPrice from '../components/utils/getPrice';

const hideBackButton = () => {
    const backButton = document.getElementsByClassName('back-button')[0];
    if (backButton) backButton.style.display = 'none';
}

const Overview = ({ payPage, deliveryCharge, subTotal, checkout }) => {
    const basket = getBasket();
    basket.length < 1 && hideBackButton()

    return (
        <div className="checkout-overview">
            {!checkout && <h3>Overview</h3>}
            {basket.length > 0 ? (
                <Fragment>
                    <ul className="list-flex">
                        {!checkout &&
                        basket.map((item, index) => [
                            <li key={index}>
                                    <div className="ellipsis">
                                        {item.title}.
                                    </div>
                                    <span>({item.quantity})</span>
                                    <p style={{ marginLeft: '30px' }}>£{(item.price * item.quantity).toFixed(2)}</p>
                            </li>,
                            item.framed === 'true' && <li className="title-option">framed</li>,
                        ])}
                    </ul>
                    <div className="total" style={{ marginBottom: payPage && 0 }}>
                            <ul
                                className="list-flex"
                                style={{ marginTop: checkout && '-20px' }}
                            >
                                <li>
                                    <p className="overview-delivery-cost">Delivery Cost</p>
                                    <p>{'£' + deliveryCharge}</p>
                                </li>
                            </ul>
                        <ul
                            className="list-flex sub-total">
                            <li>
                                <p className="overview-total-text">total</p>
                                <p className="overview-total-price">£{subTotal}</p>
                            </li>
                        </ul>
                    </div>
                    {!payPage &&
                        <Link to={{ pathname: "/pay" }}>
                            <Button
                                text="proceed to payment"
                            />
                        </Link>
                    }
                </Fragment>
            ) :
            <div>
                <p style={{ marginBottom: '24px' }}>There are no items in your basket.</p>
                <Link to={{ pathname: "/" }}>
                    <Button
                        text="back to homepage"
                    />
                </Link>
            </div>
            }
        </div>
    )
}

export default Overview;