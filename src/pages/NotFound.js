import React, { Fragment } from 'react';

import ScrollToTop from '../components/utils/ScrollTop';
import Button from '../components/Shared/Button';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Fragment>
            <ScrollToTop />,
            <main className="main-content">
                <p style={{ marginBottom: '24px' }}>Sorry this page could not be found.</p>
                <Link to={{ pathname: "/"}}>
                    <Button
                        text="back to home"
                    />
                </Link> 
            </main>
        </Fragment>
    );
}

export default NotFound;