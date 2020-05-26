import React from 'react';

import ScrollToTop from '../components/utils/ScrollTop';
import Button from '../components/Shared/Button';
import { Link } from 'react-router-dom';
import Image from '../images/delivery-goose.png';

const About = () => {
    return [
        <ScrollToTop />,
        <main className="content-side-by-side" style={{ marginTop: '60px' }}>
            
            <div>
                <h1 className="header-title" style={{ marginBottom: '24px' }}>Thank you</h1> 
                <p style={{ marginBottom: '24px' }}>Your order has been recieved and is being processed.</p>
                <Link to={{ pathname: "/"}}>
                    <Button
                        text="back to shop"
                    />
                </Link>
            </div>
            <img style={{ width: '100%', maxWidth: '230px', margin: '0 auto' }} className="about-image" src={Image} />
        </main>,
    ];
}

export default About;