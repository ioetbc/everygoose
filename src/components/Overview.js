import React from 'react';
import Button from './Shared/Button';
import { Link } from 'react-router-dom';

const Overview = ({ basket, payPage, }) => {
    const total = (basket.reduce((a, item) =>  item.price * item.quantity + a, 0));
    const deliveryCharge = total > 35 ? 0 : 2;
    const subTotal = (parseFloat(total) + deliveryCharge).toFixed(2);

    return (
        <div className="checkout-overview">
            <h3>Overview</h3>


            {basket.length > 0 ? [
                <ul className="list-flex">
                    {basket.map((item, key) =>
                        <li key={key}>
                                <div className="ellipsis">
                                    {item.title}.
                                </div>                            
                                <span>({item.quantity})</span>
                                <p style={{ marginLeft: '30px' }}>£{(item.price * item.quantity).toFixed(2)}</p>
                        </li>
                    )}
                </ul>,
                <div className="total" style={{ marginBottom: payPage && 0 }}>
                    <ul className="list-flex">
                        <li>
                            <p className="overview-delivery-cost">Delivery Cost</p>
                            <p>{deliveryCharge > 0 ? '£' + deliveryCharge.toFixed(2) : 'Nothing'}</p>
                        </li>
                    </ul>
                    <ul className="list-flex sub-total">
                        <li>
                            <p className="overview-total-text">total</p>
                            <p className="overview-total-price">£{subTotal}</p>
                        </li>
                    </ul>
                </div>,
                !payPage &&
                    <Link to={{ pathname: "/pay", state: { basket } }}>
                        <Button
                            text="proceed to payment"
                        />
                    </Link> 
            ]   
            :
            <p>There are no items in your basket.</p>
            }
        </div>
    )
}

export default Overview;