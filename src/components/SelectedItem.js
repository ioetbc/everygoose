import React from 'react';

const SelectedItem = ({ basket, updateQuantity, removeItem }) => {
    return (
        <div>
            {basket.map((item, index) =>
                <div key={index} className="selected-item">
                    <div className="item-image-wrapper desktop">
                        <img src={item.image_1_url} className="item-image" />
                    </div>
                    <div className="item-content">
                        <div className="item">
                            <p className="item-title">{item.title}.</p>
                            <div className="item-quantity">
                                <select
                                    className="quantity-select"
                                    onChange={(e) => updateQuantity(e, item, basket)}
                                    defaultValue={item.quantity}
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                    <option value={6}>6</option>
                                    <option value={7}>7</option>
                                    <option value={8}>8</option>
                                    <option value={9}>9</option>
                                    <option value={10}>10</option>
                                    <option value={11}>11</option>
                                    <option value={12}>12</option>
                                    <option value={13}>13</option>
                                    <option value={14}>14</option>
                                    <option value={15}>15</option>
                                    <option value={16}>16</option>
                                    <option value={17}>17</option>
                                    <option value={18}>18</option>
                                    <option value={19}>19</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                            <div className="item-remove mobile">
                                <div className="item-price">
                                    <p className="price">£{(item.price * item.quantity).toFixed(2)}</p>
                                    <p
                                        className="remove text-small"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => removeItem({ item, basket })}
                                    >
                                        Remove
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="item-image-wrapper mobile">
                        <img src={item.image_1_url} className="item-image" />
                    </div>
                    <div className="item-remove desktop">
                            <div className="item-price">
                                <p className="price">£{(item.price * item.quantity).toFixed(2)}</p>
                                <p
                                    className="remove text-small"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => removeItem({ item, basket })}
                                >
                                    Remove
                                </p>
                            </div>
                        </div>
                </div>
            )}
        </div>
    )
}


export default SelectedItem;