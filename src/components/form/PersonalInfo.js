import React from 'react';
import Input from '../form/Input';

const PersonalInfo = ({ onBlur }) => {
    return [
        <div class="input-side-by-side">
            <Input
                name="firstName"
                type="text"
                label="First name"
                onBlur={onBlur}
            />

            <Input
                name="lastName"
                type="text"
                label="Last name"
                onBlur={onBlur}
            />
        </div>,
        <div class="input-side-by-side">
            <Input
                name="email"
                type="email"
                label="Email"
                onBlur={onBlur}
            />
            <Input
                name="phone"
                type="number"
                label="Phone number"
                onBlur={onBlur}
            />
        </div>,
    ];
};

export default PersonalInfo;