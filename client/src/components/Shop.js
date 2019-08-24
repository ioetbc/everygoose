import React, { Component } from 'react';
import React from 'react';
import Prismic from 'prismic-javascript';

import { Link } from 'react-router-dom';
import Logo from '../images/card-placeholder.jpg';

class Page extends Component {
	constructor(props){
		super(props);
		this.state = {
			produts: [
                {
                    title: 'chip thief gull illustrated 1.',
                    price: 2.50,
                    quantity: 1,
                },
                {
                    title: 'chip thief gull illustrated 2.',
                    price: 2.50,
                    quantity: 1,
                },
                {
                    title: 'chip thief gull illustrated 3.',
                    price: 2.50,
                    quantity: 1,
                },
                {
                    title: 'chip thief gull illustrated 4.',
                    price: 2.50,
                    quantity: 1,
                },
                {
                    title: 'chip thief gull illustrated 5.',
                    price: 2.50,
                    quantity: 1,
                },
                {
                    title: 'chip thief gull illustrated 6.',
                    price: 2.50,
                    quantity: 1,
                },
                {
                    title: 'chip thief gull illustrated 7.',
                    price: 2.50,
                    quantity: 1,
                },
            ],
			doc: null,   
        }
		if (this.props.prismicCtx) {
			this.fetchPage(props);
		}
    }

	render() {
        return (
           
        );
	}
}

export default Page;

