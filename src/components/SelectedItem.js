import React from 'react';
import updateBasket from '../components/utils/updateBasket';

const SelectedItem = ({ basket, removeItem }) => {

    return (
        <div>
            {basket.map((item, key) =>
                <div className="selected-item">
                    <div className="item-image-wrapper">
                        <img src={item.image_1_url} className="item-image" />
                    </div>
                    <div className="item-content">
                        <div className="item">
                            <p className="item-title">{item.title}.</p>
                            <div className="item-quantity">
                                <p className="text-small">Quantity</p>
                                <select
                                    className="quantity-select"
                                        onChange={(e) => {
                                            updateBasket(item, {
                                                key: 'quantity',
                                                value: e.target.value
                                            }
                                        )}}
                                    >
                                    <option value={item.quantity} selected disabled hidden>{item.quantity}</option>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="item-remove">
                        <div className="item-price">
                            <p className="price">£{(item.price * item.quantity).toFixed(2)}</p>
                            <p className="remove text-small" style={{ cursor: 'pointer' }} onClick={() => removeItem(item)}>Remove</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


export default SelectedItem;