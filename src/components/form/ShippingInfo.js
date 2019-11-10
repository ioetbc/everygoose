import React from 'react';
import Input from '../form/Input';
import Country from '../form/Country';

const ShippingInfo = ({ onBlur, handleCountry }) => {
    return [
        <Input
            name="addressFirstLine"
            type="text"
            label="Address line one"
            onBlur={onBlur}
        />,
        <Input
            name="addressSecondLine"
            type="text"
            label="Address second one"
            onBlur={onBlur}
        />,
        <Input
            name="addressThirdLine"
            type="text"
            label="Address third one"
            onBlur={onBlur}
        />,
        <Country
            onClick={handleCountry}
        />,
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
        </div>,
    ];
};

export default ShippingInfo;