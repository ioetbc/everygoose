import React, { Component } from 'react';
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
			notFound: false,
		}
    }

	render() {
        return (
            <div className="shop">
                <div className="shop-gallery">
                {this.state.produts.map((details, key) => 
                    <Link to={{ pathname: "/product", state: { details } }}>
                        <div key={key} className="shop-items">
                            <img src={Logo} key={key} className="shop-images"></img>
                            <p>{details.title}</p>
                            <p>£{details.price}</p>
                        </div> 
                    </Link>
                )}
                </div>
            </div>
        );
	}
}

export default Page;

