import React, { Component } from 'react';
import NotFound from '../NotFound';
import Shop from './Shop';
import PrismicReact from 'prismic-reactjs';

export default class Page extends Component {
	constructor(props){
		super(props);
		this.state = {
			produts: [1,2,3,4,5,6],
			notFound: false,
		}
    }

	render() {
        return (
            <div className="navigation">
                <h4>shop</h4>
                <ul>
                    <li>card</li>
                    <li>card</li>
                    <li>card</li>
                    <li>card</li>
                    <li>card</li>
                    <li>card</li>
                </ul>
                <h4>about</h4>
                <h4>contact</h4>
            </div>
        )
        
	}
}
