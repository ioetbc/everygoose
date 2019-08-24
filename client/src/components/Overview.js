import React from 'react';
import Button from './Shared/Button';
import { Link } from 'react-router-dom';

const Overview = ({ basket, payPage, deliveryCost }) => {

    return (
        <div className="checkout-overview">
            <h3>Overview</h3>

            {basket.length > 0 ? [
                <ul className="list-flex">
                    {basket.map((item, key) =>
                        <li>
                            <p>{item.title}</p>
                            <p>£{item.price * item.quantity}</p>
                        </li>
                    )}
                </ul>,
                <div className="total">
                    <ul className="list-flex">
                        <li>
                            <p>delivery cost</p>
                            <p>£2.00</p>
                        </li>
                    </ul>
                    <ul className="list-flex sub-total">
                        <li>
                            <p>total</p>
                            <p>{basket.reduce((a, item) =>  item.price * item.quantity + a, 0)}</p>
                        </li>
                    </ul>
                </div>,
                <Link to={{ pathname: "/pay", state: { basket } }}>
                    <Button
                        text={payPage ? 'pay now' : 'proceed to payment'}
                    />
                </Link>
            ]   
            :
            <p>nothing in your basket</p>
            }
        </div>
    )
}

export default Overview;