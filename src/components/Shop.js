import React, { Component } from 'react';
import NotFound from '../NotFound';
import PrismicReact from 'prismic-reactjs';

class Page extends Component {
	constructor(props){
		super(props);
		this.state = {
			produts: [1,2,3,4,5,6,7,8,9,10,11,12],
			notFound: false,
		}
    }

	render() {
        return (
            <div className="shop">
                <div className="shop-gallery">
                {this.state.produts.map((item, key) => 
                    <div className="shop-items">
                        <div key={key} className="shop-images"></div>
                        <p>Chip Thief Gull Illustrated.</p>
                        <p>£2.50</p> 
                    </div> 
                )}
                </div>
            </div>
        );
	}
}

export default Page;