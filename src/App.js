import React, { Component } from 'react';
import Prismic from 'prismic-javascript';
import { find, get } from 'lodash';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  HashRouter
} from 'react-router-dom';

import history from './components/utils/history';
import Page from './pages/Page';
import Product from './pages/Product';
import Checkout from './pages/Checkout'
import Pay from './pages/Pay';
import Contact from './pages/Contact';
import TermsConditions from './pages/Terms';
import Trade from './pages/Trade';
import About from './pages/About';
import Done from './pages/Done';
import Sorry from './pages/Sorry';
import Delivery from './pages/Delivery';
import NotFound from './pages/NotFound';
import Navigation from './components/Navigation';
import Footer from './components/Footer'
import './App.scss';
import Header from './components/Header';
import FloatingButton from './components/utils/floatingBasket';
import BackButton from './components/utils/BackButton'

import updateBasket from './components/utils/updateBasket';
import getBasket from './components/utils/getBasket';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			basket: JSON.parse(localStorage.getItem('session')) || [],
			cardTypes: [],
			products: [],
			doc: null,
			filtered: false,
		}
		this.handleNavigationFilter = this.handleNavigationFilter.bind(this);

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

	handleNavigationFilter(item) {
		if (item === 'all') {
			return this.setState({ filteredProducts: false });
		}

		this.setState({
			filteredProducts: this.state.products.filter(product => product.type === item),
		});
	}

	async fetchPage() {
		const doc = await Prismic.client('https://everygoose.prismic.io/api/v2')
			.getByID('XVxFfREAACEAlCKe');

		const cardTypes = [];
		doc.data.products.forEach(item => {
			this.state.products.push({
				title: item.product_title[0].text,
				price: item.product_price.toFixed(2),
				image_1_url: item.image_1.url,
				image_2_url: item.image_2.url,
				image_3_url: item.image_3.url,
				quantity: 1,
				description: item.product_description[0].text,
				type: item.type_of_card,
				product_type: item.product_type,
				product_dimensions: item.product_dimensions,
			});
			
			cardTypes.push(item.type_of_card);
		});

		this.setState({ cardTypes, doc });
	}
	
	render() {
		const { cardTypes, doc, products, filteredProducts } = this.state;
		const basket = getBasket();

		return ([
			<div className="app">	
				<HashRouter>
					<Switch>
						<Route exact path="/" render={routeProps => [
							<Navigation
								navigationItems={cardTypes}
								handleNavigationFilter={this.handleNavigationFilter}
								shop
							/>,
							<div className="shop-page">
								<Header
									title='Shop'
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
							</div>,
							<FloatingButton />
						]} />

						<Route exact path="/product" render={routeProps => [
							<Navigation
								navigationItems={cardTypes}
								handleNavigationFilter={this.handleNavigationFilter}
								product
							/>,
							<div className="standard-page">
								<Header
									title='Card'
								/>

								<BackButton
									title="homepage"
									link="/#/"
								/>

								<Product
									{...routeProps}
									prismicCtx={this.props.prismicCtx}
									addToBasket={updateBasket}
									basket={basket}
								/>
								<FloatingButton />
							</div>
						]} />

						<Route exact path="/checkout" render={routeProps => [
							<Navigation
								navigationItems={cardTypes}
								handleNavigationFilter={this.handleNavigationFilter}
								basket
								classModifier="wide"
								basket={basket}
							/>,
							<div className="checkout-page">
								<Header
									title='Checkout'
								/>
								
								<BackButton
									title="product page"
									link="/#/product"
								/>

								<Checkout
									{...routeProps}
									prismicCtx={this.props.prismicCtx}
								/>
							</div>
						]} />

						<Route exact path="/pay" render={routeProps => [
							<Navigation
								navigationItems={cardTypes}
								handleNavigationFilter={this.handleNavigationFilter}
								classModifier="wide"
							/>,
							<div className="checkout-page">
								<Header
									title='Pay'
								/>

								<BackButton
									title="checkout page"
									link="/#/checkout"
								/>

								<Pay
									{...routeProps}
									prismicCtx={this.props.prismicCtx}
								/>
							</div>,
						]} />

						<Route exact path="/contact" render={routeProps => [
							<Navigation
								navigationItems={cardTypes}
								handleNavigationFilter={this.handleNavigationFilter}
							/>,
							<div className="checkout-page">
								<Header
									title='Contact'
								/>

								<BackButton
									title="homepage"
									link="/#/"
								/>

								<Contact
									{...routeProps}
								/>
							</div>,
						]} />

						<Route exact path="/terms" render={routeProps => [
							<Navigation
								navigationItems={cardTypes}
								handleNavigationFilter={this.handleNavigationFilter}
							/>,
							<div className="checkout-page">
								<Header
									title='Terms & Conditions'
								/>

								<BackButton
									title="homepage"
									link="/#/"
								/>

								<TermsConditions prismicCtx={this.props.prismicCtx} />
							</div>,
						]} />

						<Route exact path="/trade" render={routeProps => [
							<Navigation
								navigationItems={cardTypes}
								handleNavigationFilter={this.handleNavigationFilter}
							/>,
							<div className="checkout-page">
								<Header
									title='Trade'
								/>

								<BackButton
									title="homepage"
									link="/#/"
								/>

								<Trade prismicCtx={this.props.prismicCtx} />
							</div>,
						]} />

						<Route exact path="/delivery" render={routeProps => [
							<Navigation
								navigationItems={cardTypes}
								handleNavigationFilter={this.handleNavigationFilter}
							/>,
							<div className="checkout-page">
								<Header
									title='Delivery & Returns'
								/>

								<BackButton
									title="homepage"
									link="/#/"
								/>

								<Delivery prismicCtx={this.props.prismicCtx} />
							</div>,
						]} />

						<Route exact path="/about" render={routeProps => [
							<Navigation
								navigationItems={cardTypes}
								handleNavigationFilter={this.handleNavigationFilter}
							/>,
							<div className="checkout-page">
								<Header
									title='About'
								/>

								<BackButton
									title="homepage"
									link="/#/"
								/>

								<About prismicCtx={this.props.prismicCtx}/>
							</div>,
						]} />

						<Route exact path="/done" render={routeProps => [
							<Navigation
								navigationItems={cardTypes}
								handleNavigationFilter={this.handleNavigationFilter}
								basket={basket}
							/>,
							<div className="checkout-page">
								<Header
									title='Thank you'
									basket={basket}
								/>

								<BackButton
									title="homepage"
									link="/#/"
								/>

								<Done />
							</div>,
						]} />

						<Route exact path="/sorry" render={routeProps => [
							<Navigation
								navigationItems={cardTypes}
								handleNavigationFilter={this.handleNavigationFilter}
							/>,
							<div className="checkout-page">
								<Header
									title='Sorry'
								/>

								<BackButton
									title="homepage"
									link="/#/"
								/>

								<Sorry />
							</div>,
						]} />

						<Route component={NotFound} />
					</Switch>
				</HashRouter>
			</div>,
			<Router history={history}>
				<Route>
					<Footer />			
				</Route>
			</Router>,
		])
	}
};

export default App;
