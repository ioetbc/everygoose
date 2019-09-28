import React from 'react';

import ScrollToTop from '../components/utils/ScrollTop';
import Button from '../components/Shared/Button';
import { Link } from 'react-router-dom';

const About = () => {
    return [
        <ScrollToTop />,
        <main className="main-content">
            <p style={{ marginBottom: '24px' }}>Sorry there was an error processing your order. Please try again later.</p>
            <Link to={{ pathname: "/"}}>
                <Button
                    text="back to home"
                />
            </Link> 
        </main>,
    ];
}

export default About;