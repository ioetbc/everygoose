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

import BackIcon from './images/misc/back-button.svg';
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
								classModifier="shop"
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
							</div>
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

								<Link to={{ pathname: "/" }}>
									<div className="back-button">
										<img src={BackIcon} alt="" />
										<p className="back-button-text">back to homepage</p>
									</div>
								</Link>

								<Product
									{...routeProps}
									prismicCtx={this.props.prismicCtx}
									addToBasket={updateBasket}
								/>
							</div>
						]} />

						<Route exact path="/checkout" render={routeProps => [
							<Navigation
								navigationItems={cardTypes}
								handleNavigationFilter={this.handleNavigationFilter}
								basket
								classModifier="wide"
							/>,
							<div className="checkout-page">
								<Header
									title='checkout'
								/>

								<Link to={{ pathname: "/" }}>
									<div className="back-button">
										<img src={BackIcon} alt="" />
										<p className="back-button-text">back to homepage</p>
									</div>
								</Link>

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
									title='pay'
								/>

								<Link to={{ pathname: "/" }}>
									<div className="back-button">
										<img src={BackIcon} alt="" />
										<p className="back-button-text">back to homepage</p>
									</div>
								</Link>

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

								<Link to={{ pathname: "/" }}>
									<div className="back-button">
										<img src={BackIcon} alt="" />
										<p className="back-button-text">back to homepage</p>
									</div>
								</Link>

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

								<Link to={{ pathname: "/" }}>
									<div className="back-button">
										<img src={BackIcon} alt="" />
										<p className="back-button-text">back to homepage</p>
									</div>
								</Link>

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

								<Link to={{ pathname: "/" }}>
									<div className="back-button">
										<img src={BackIcon} alt="" />
										<p className="back-button-text">back to homepage</p>
									</div>
								</Link>

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

								<Link to={{ pathname: "/" }}>
									<div className="back-button">
										<img src={BackIcon} alt="" />
										<p className="back-button-text">back to homepage</p>
									</div>
								</Link>

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

								<Link to={{ pathname: "/" }}>
									<div className="back-button">
										<img src={BackIcon} alt="" />
										<p className="back-button-text">back to homepage</p>
									</div>
								</Link>

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

								<Link to={{ pathname: "/" }}>
									<div className="back-button">
										<img src={BackIcon} alt="" />
										<p className="back-button-text">back to homepage</p>
									</div>
								</Link>

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

								<Link to={{ pathname: "/" }}>
									<div className="back-button">
										<img src={BackIcon} alt="" />
										<p className="back-button-text">back to homepage</p>
									</div>
								</Link>

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
