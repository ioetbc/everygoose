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
import Done from './pages/Done';
import Sorry from './pages/Sorry';
import Delivery from './pages/Delivery';
import NotFound from './pages/NotFound';
import Navigation from './components/Navigation';
import Footer from './components/Footer'
import Header from './components/Header';
import FloatingButton from './components/utils/floatingBasket';
import BackButton from './components/utils/BackButton'

import './App.scss';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			basket: JSON.parse(localStorage.getItem('session')) || [],
			cardTypes: [],
			products: [],
			doc: null,
			filtered: false,
			pages: []
		}
		this.handleNavigationFilter = this.handleNavigationFilter.bind(this);
		this.fetchPage = this.fetchPage.bind(this);

		if (this.props.prismicCtx) {
			this.fetchPage(props);
		}
	}

	componentDidMount() {
		fadeInSections(this.fetchPage);
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

		this.setState({
			filteredProducts: this.state.products.filter(product => product.type === item),
		});
	}

	async fetchPage() {
		const { cardTypes } = this.state;
		const doc = await Prismic.client('https://everygoose.prismic.io/api/v2')
			.getByID('XVxFfREAACEAlCKe');

		const omitedProductData = doc.data.products.filter(p => !p.hide_product);
		const omitedPrintData = doc.data.prints.filter(p => !p.hide_product);
		const allProducts = omitedProductData.concat(omitedPrintData).reverse();

		const chunked = chunkProducts(allProducts)

		allProducts.forEach(item => {
			this.state.products.push({
				title: item.product_title[0].text,
				price: get(item, 'product_price', 0).toFixed(2),
				a4_price: get(item, 'product_price', 0).toFixed(2),
				a3_price: get(item, 'a3_price', 0).toFixed(2),
				a4_framed_price: get(item, 'a4_framed_price', 0).toFixed(2),
				a3_framed_price: get(item, 'a3_framed_price', 0).toFixed(2),
				image_1_url: item.image_1.url,
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

		this.setState({ cardTypes: uniq(cardTypes), doc });
	}
	
	render() {
		const { cardTypes, doc, products, filteredProducts } = this.state;
		const basket = getBasket();

		console.log({products})

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
								/>
								<div className="shop-page">
									<Header
										shop
										navigationItems={cardTypes}
										handleNavigationFilter={this.handleNavigationFilter}
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
