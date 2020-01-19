import React from 'react';

const input = ({ name, type, label, onBlur, style }) => {
    return (
        <div className='text-field--container'>
            <div className='text-field'>
                <input
                    className='text-field--input'
                    name={name}
                    id={name}
                    placeholder=' '
                    type={type}
                    onBlur={(e) => onBlur(e)}
                    style={style}
                />
                <label className='text-field--label' htmlFor={name}>{label}</label>
            </div>
        </div>
    )
};

export default input;