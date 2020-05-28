import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import ScrollToTop from '../components/utils/ScrollTop';
import TestImage from '../images/square-test.jpg'
import TestImageLandscape from '../images/square-test-landscape.jpg'

const Page = ({ doc, products }) => {
	return (
		<Fragment>
			<ScrollToTop />
			<main className="main-content">
				<div className="shop">
					<div className="shop-gallery">
						{doc ? 
							products.map((item, index) => <div key={index} className="shop-items">
									<Link className="link" to={{ pathname: "/product", state: { item } }}>
										<img src={item.thumbnail} className="shop-images"></img>
										<p className="product-title">{item.title}</p>
										<p className="product-price">£{item.price}</p>
									</Link>
								</div>
							)
 						: [1,2,3,4,5,6,7,8,9,10].map(() => <div className="shop-items placeholder">
							<div className="palceholder-shop-image"></div>
							<div className="placeholder-shop-title"></div>
							<div className="placeholder-shop-price"></div>
						</div>
						)}
					</div>
				</div>
			</main>
		</Fragment>
	)
}

export default Page;
