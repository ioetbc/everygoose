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
									<div key={key} className="shop-items">
										<Link to={{ pathname: "/product", state: { item } }}>
												<img src={item.image_1_url} key={key} className="shop-images"></img>
												<p>{item.title}</p>
												<p>£{item.price}</p>
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
				<p>loading</p>
			)
		}
	}
}
