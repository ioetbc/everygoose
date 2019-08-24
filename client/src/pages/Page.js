import React, { Component } from 'react';
import Prismic from 'prismic-javascript';

import { Link } from 'react-router-dom';
import Logo from '../images/card-placeholder.jpg';

export default class Page extends Component {
	constructor(props){
		super(props);
		this.state = {
			products: [],
			doc: null,
        }
		if (this.props.prismicCtx) {
			this.fetchPage(props);
		}
	}

	componentDidUpdate(prevProps) {
		this.props.prismicCtx.toolbar();
		if (!prevProps.prismicCtx) {
			this.fetchPage(this.props);
		}
	}

	async fetchPage() {
		const doc = await Prismic.client('https://everygoose.prismic.io/api/v2')
			.getByID('XVxFfREAACEAlCKe');

		doc.data.products.forEach(item => {
			this.state.products.push({
				title: item.product_title[0].text,
				price: item.product_price[0].text,
				image_1_url: item.image_1.url,
				image_2_url: item.image_2.url,
				image_3_url: item.image_3.url,
				quantity: 1,
				description: item.product_description[0].text,
			});
		});

		this.setState({ doc });
	}

	render() {
		const { doc, products } = this.state;

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
