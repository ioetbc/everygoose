import React, { Fragment } from 'react';
import Input from '../form/Input';

const PersonalInfo = ({ onBlur }) => {
    return (
        <Fragment>
            <h3>contact details</h3>
            <div className="input-side-by-side">
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
            </div>
            <div className="input-side-by-side">
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
            </div>
        </Fragment>
    );
};

export default PersonalInfo;