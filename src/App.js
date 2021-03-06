import React, { Component, Fragment } from 'react';
import Prismic from 'prismic-javascript';
import { uniq, get } from 'lodash';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  HashRouter
} from 'react-router-dom';

import updateBasket from './components/utils/updateBasket';
import { BasketHandler } from './components/utils/updateBasketV2';
import getBasket from './components/utils/getBasket';
import fadeInSections from './components/utils/fadeInSections';
import chunkProducts from './components/utils/chunkProducts';

import Page from './pages/Page';
import Product from './pages/Product';
import Checkout from './pages/Checkout'
import Pay from './pages/Pay';
import Contact from './pages/Contact';
import TermsConditions from './pages/Terms';
import Trade from './pages/Trade';
import About from './pages/About';
import Weddings from './pages/Weddings';
import Murals from './pages/Murals';
import Done from './pages/Done';
import Sorry from './pages/Sorry';
import Delivery from './pages/Delivery';
import NotFound from './pages/NotFound';
import Navigation from './components/Navigation';
import Footer from './components/Footer'
import Header from './components/Header';
import FloatingButton from './components/utils/floatingBasket';
import CookieBanner from './components/utils/CookieBanner';
import BackButton from './components/utils/BackButton'

import './App.scss';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			basket: JSON.parse(localStorage.getItem('session')) || [],
			customer: JSON.parse(localStorage.getItem('customer')) || localStorage.setItem('customer', JSON.stringify({ cookieConsent: false })),
			enableCookieBanner: true,
			cardTypes: [],
			products: [],
			doc: null,
			filtered: false,
			pages: [],
			pageNo: 1,
		}
		this.handleNavigationFilter = this.handleNavigationFilter.bind(this);
		this.fetchPage = this.fetchPage.bind(this);
		this.cookieConsent = this.cookieConsent.bind(this);

		if (this.props.prismicCtx) {
			this.fetchPage(props);
		}
	}

	componentDidMount() {
		fadeInSections(this.fetchPage, false);
	}

	componentDidUpdate(prevProps) {
		this.props.prismicCtx.toolbar();
		if (!prevProps.prismicCtx) {
			this.fetchPage(this.props);
		}
	}

	handleNavigationFilter(item) {
		if (item === 'all') {
			return this.setState({ filteredProducts: false });
		}
		const chunked = chunkProducts(this.state.allProducts, this.state.allProducts.length);
		const all = [];
		chunked[0].forEach(item => {
			all.push({
				title: item.product_title[0].text,
				price: get(item, 'product_price', 0).toFixed(2),
				a4_price: get(item, 'product_price', 0).toFixed(2),
				image_1_url: item.image_1.url,
				thumbnail: item.thumbnail.url,
				quantity: 1,
				description: item.product_description[0].text,
				type: item.type_of_card,
				product_type: item.product_type,
				card_dimensions: {
					width: item.product_width,
					height: item.product_height
				},
				size: 'a4',
				framed: 'false',
				product_code: item.product_code,
			});
		});

		this.setState({
			filteredProducts: all.filter(product => product.type === item),
		});
	}

	async fetchPage() {
		const { cardTypes, pageNo } = this.state;
		const doc = await Prismic.client('https://everygoose.prismic.io/api/v2')
			.getByID('XVxFfREAACEAlCKe');

		const allProducts = doc.data.products.filter(p => !p.hide_product).reverse();
		const chunked = chunkProducts(allProducts, 12);
		this.setState({ pageNo: pageNo + 1 });
		const pages = chunked[pageNo] || []

		pages.forEach(item => {
			this.state.products.push({
				title: item.product_title[0].text,
				price: get(item, 'product_price', 0).toFixed(2),
				a4_price: get(item, 'product_price', 0).toFixed(2),
				image_1_url: item.image_1.url,
				thumbnail: item.thumbnail.url,
				quantity: 1,
				description: item.product_description[0].text,
				type: item.type_of_card,
				product_type: item.product_type,
				card_dimensions: {
					width: item.product_width,
					height: item.product_height
				},
				size: 'a4',
				framed: 'false',
				product_code: item.product_code,
			});
		});

		allProducts.forEach(item => {
			cardTypes.push(item.type_of_card);
		});

		cardTypes.unshift('all');

		this.setState({ cardTypes: uniq(cardTypes), doc, allProducts });
	}

	cookieConsent() {
		this.setState({ enableCookieBanner: false });
		localStorage.setItem('customer', JSON.stringify({ cookieConsent: true }));
	}
	
	render() {
		const { cardTypes, doc, products, filteredProducts, enableCookieBanner } = this.state;
		const basket = getBasket();
		const customer = JSON.parse(localStorage.getItem('customer'));

		return (
			<Fragment>
				<div className="app">	
				<HashRouter>
					<Switch>
						<Route exact path="/" render={routeProps => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
									shop
									classModifier="banner"
								/>
								<div className="shop-page">
									<Header
										shop
										navigationItems={cardTypes}
										handleNavigationFilter={this.handleNavigationFilter}
										title='Shop'
									/>
									<Page
										{...routeProps}
										prismicCtx={this.props.prismicCtx}
										getCardType={this.getCardType}
										doc={doc}
										products={filteredProducts || products}
									/>
								</div>
								<FloatingButton />
							</Fragment>
						)} />

						<Route exact path="/product" render={routeProps => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
									product
									classModifier="standard"
								/>
								<div className="standard-page">
									<Header />

									<BackButton
										title="back to shop"
										link="/#/"
									/>

									<Product
										{...routeProps}
										prismicCtx={this.props.prismicCtx}
									/>
									<FloatingButton />
								</div>
							</Fragment>
						)} />

						<Route exact path="/checkout" render={routeProps => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
									basket
									basket={basket}
								/>
								<div className="checkout-page">
									<Header
										title='Checkout'
									/>
									<BackButton
										title="continue shopping"
										link="/#/"
									/>
									<Checkout
										{...routeProps}
										prismicCtx={this.props.prismicCtx}
									/>
								</div>
							</Fragment>
						)} />

						<Route exact path="/pay" render={routeProps => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
								/>
								<div className="checkout-page">
									<Header
										title='Pay'
									/>
									<BackButton
										title="back to checkout page"
										link="/#/checkout"
									/>
									<Pay
										{...routeProps}
										prismicCtx={this.props.prismicCtx}
									/>
								</div>
							</Fragment>
						)} />

						<Route exact path="/contact" render={routeProps => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
								/>
								<div className="checkout-page">
									<Header
										title='Contact'
									/>

									<BackButton
										title="back to shop"
										link="/#/"
									/>

									<Contact
										{...routeProps}
										prismicCtx={this.props.prismicCtx}
									/>
								</div>
							</Fragment>
						)} />

						<Route exact path="/terms" render={() => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
								/>
								<div className="checkout-page">
									<Header
										title='Terms & Conditions'
									/>

									<BackButton
										title="back to shop"
										link="/#/"
									/>

									<TermsConditions prismicCtx={this.props.prismicCtx} />
								</div>
							</Fragment>
						)} />

						<Route exact path="/trade" render={() => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
								/>
								<div className="checkout-page">
									<Header
										title='Trade'
									/>

									<BackButton
										title="back to shop"
										link="/#/"
									/>

									<Trade prismicCtx={this.props.prismicCtx} />
								</div>
							</Fragment>
						)} />

						<Route exact path="/delivery" render={() => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
								/>
								<div className="checkout-page">
									<Header
										title='Delivery & Returns'
									/>

									<BackButton
										title="back to shop"
										link="/#/"
									/>

									<Delivery prismicCtx={this.props.prismicCtx} />
								</div>
							</Fragment>
						)} />

						<Route exact path="/about" render={() => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
								/>
								<div className="checkout-page">
									<Header
										title='About'
									/>

									<BackButton
										title="back to shop"
										link="/#/"
									/>

									<About prismicCtx={this.props.prismicCtx}/>
								</div>
							</Fragment>
						)} />

						<Route exact path="/weddings" render={() => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
								/>
								<div className="checkout-page">
									<Header
										title='Weddings'
									/>

									<BackButton
										title="back to shop"
										link="/#/"
									/>

									<Weddings prismicCtx={this.props.prismicCtx}/>
								</div>
							</Fragment>
						)} />

						<Route exact path="/murals" render={() => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
								/>
								<div className="checkout-page">
									<Header
										title='Murals'
									/>

									<BackButton
										title="back to shop"
										link="/#/"
									/>

									<Murals prismicCtx={this.props.prismicCtx}/>
								</div>
							</Fragment>
						)} />

						<Route exact path="/done" render={() => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
									basket={basket}
								/>
								<div className="checkout-page">

								

									<Header
										basket={basket}
									/>

								<BackButton
									title="back to shop"
									link="/#/"
								/>

									<Done />
								</div>
							</Fragment>
						)} />

						<Route exact path="/sorry" render={() => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
								/>
								<div className="checkout-page">
									<Header />

									<BackButton
										title="back to shop"
										link="/#/"
									/>

									<Sorry />
								</div>
							</Fragment>
						)} />

						<Route render={() => (
							<Fragment>
								<Navigation
									navigationItems={cardTypes}
									handleNavigationFilter={this.handleNavigationFilter}
								/>
								<div className="checkout-page">
									<Header
										title='Sorry'
									/>

									<BackButton
										title="back to shop"
										link="/#/"
									/>

									<NotFound />
								</div>
							</Fragment>
						)} />
					</Switch>

				</HashRouter>

				{(enableCookieBanner && !customer.cookieConsent) &&
					<CookieBanner
						handleConsent={this.cookieConsent}
					/>
				}
			</div>
			<Router>
				<Route>
					<Footer />			
				</Route>
			</Router>
			</Fragment>
		)
	}
};

export default App;
