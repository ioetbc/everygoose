import React, { Component } from 'react';
import NotFound from '../NotFound';
import Header from './Header';
import PrismicReact from 'prismic-reactjs';

export default class Page extends Component {
	constructor(props){
		super(props);
		this.state = {
			produts: [1,2,3,4,5,6,7,8,9,10,11,12],
			notFound: false,
		}
    }

	render() {
        let items;
        items = this.state.produts.map((item, key) =>
            <div key={key} className="shop-images"></div>
        );
        return ([
            <Header title='shop' />,
            <div className="shop">
                <div className="shop-gallery">
                    {items}                
                </div>
            </div>
        ]);
	}
}
