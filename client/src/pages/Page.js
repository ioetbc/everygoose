import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Page extends Component {
	render() {
		const { doc, products } = this.props;
		if (doc) {
			return (
				<main className="main-content">
					<div className="shop">
						<div className="shop-gallery">
							{products.map((item, key) => {
								return (
									<Link to={{ pathname: "/product", state: { item } }}>
										<div key={key} className="shop-items">
											<img src={item.image_1_url} key={key} className="shop-images"></img>
											<p>{item.title}</p>
											<p>£{item.price}</p>
										</div>
									</Link>
								);
							})}
						</div>
					</div>
				</main>
			)
		} else {
			return (
				<p>loading</p>
			)
		}
	}
}
