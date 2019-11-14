import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ScrollToTop from '../components/utils/ScrollTop';

export default class Page extends Component {
	render() {
		const { doc, products } = this.props;
		if (doc) {
			return [
				<ScrollToTop />,
				<main className="main-content">
					<div className="shop">
						<div className="shop-gallery">
							{products.map((item, key) => {
								return (		
									<div key={key} className="shop-items" >
										<Link className="link" to={{ pathname: "/product", state: { item } }}>
											<img src={item.image_1_url} key={key} className="shop-images"></img>
											<p className="product-title">{item.title}</p>
											<p className="product-price">£{item.price}</p>
										</Link>
									</div>
								);
							})}
						</div>
					</div>
				</main>,
			]
		} else {
			return (
				<main className="main-content">
					<div className="shop">
						<div className="shop-gallery">
							{[1,2,3,4,5,6].map((item, key) => {
								return (		
									<div key={key} className="shop-items placeholder" >
										<div key={key} className="palceholder-shop-image"></div>
										<div className="placeholder-shop-title"></div>
										<div className="placeholder-shop-price"></div>
									</div>
								);
							})}
						</div>
					</div>
				</main>
			)
		}
	}
}
