import React from 'react';

import ScrollToTop from '../components/utils/ScrollTop';
import Button from '../components/Shared/Button';
import { Link } from 'react-router-dom';

const Sorry = () => {
    return [
        <ScrollToTop />,
        <main className="main-content">
            <h1 className="header-title" style={{ marginBottom: '24px' }}>Sorry</h1>
            <p style={{ marginBottom: '24px' }}>Sorry there was an error processing your order. Please try again later.</p>
            <Link to={{ pathname: "/"}}>
                <Button
                    text="back to home"
                />
            </Link> 
        </main>,
    ];
}

export default Sorry;