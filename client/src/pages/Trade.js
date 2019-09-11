import React from 'react';

import ScrollToTop from '../components/utils/ScrollTop';

const Trade = () => {
    return [
        <ScrollToTop />,
        <main className="main-content" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="content-center">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur maiores ipsa repellendus, necessitatibus earum iste dolorum eos! Qui facere iure laborum optio numquam cumque odit quibusdam. Id reprehenderit ipsa excepturi.</p>
            </div>
        </main>,
    ]
}

export default Trade;