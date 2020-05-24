import React from 'react';

import ScrollToTop from '../components/utils/ScrollTop';
import Button from '../components/Shared/Button';
import { Link } from 'react-router-dom';

const About = () => {
    return [
        <ScrollToTop />,
        <main className="main-content">
            <h1 className="header-title" style={{ marginBottom: '24px' }}>Thank you</h1> 
            <p style={{ marginBottom: '24px' }}>Your order has been recieved and is being processed.</p>
            <Link to={{ pathname: "/"}}>
                <Button
                    text="back to shop"
                />
            </Link> 
        </main>,
    ];
}

export default About;