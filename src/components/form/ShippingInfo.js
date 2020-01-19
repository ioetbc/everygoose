import React, { Fragment } from 'react';
import Input from '../form/Input';
import Country from '../form/Country';

const ShippingInfo = ({ onBlur, handleCountry, rednerShippingQuestions }) => {
    return [
        rednerShippingQuestions ? 
            <Fragment>
                <h3>Shipping address</h3>
                <Input
                    name="addressFirstLine"
                    type="text"
                    label="Address line one"
                    onBlur={onBlur}
                />
                <Input
                    name="addressSecondLine"
                    type="text"
                    label="Address second one"
                    onBlur={onBlur}
                />
                <Input
                    name="addressThirdLine"
                    type="text"
                    label="Address third one"
                    onBlur={onBlur}
                />
                <Country
                    onClick={handleCountry}
                    onBlur={onBlur}
                />
                <div class="input-side-by-side">
                    <Input
                        name="city"
                        type="text"
                        label="City"
                        onBlur={onBlur}
                    />
                    <Input
                        name="postcode"
                        type="text"
                        label="Postcode"
                        onBlur={onBlur}
                        style={{ textTransform: 'uppercase' }}
                    />
                </div>
            </Fragment>
            :
            <div className="question-lock-up">
                <h3>Shipping address</h3>
            </div>
    ];
};

export default ShippingInfo;