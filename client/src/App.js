import React, { Component } from 'react';
import { find, get } from 'lodash';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import history from './components/utils/history';
import Page from './pages/Page';
import Product from './pages/Product';
import Checkout from './pages/Checkout'
import Pay from './pages/Pay';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Navigation from './components/Navigation';
import Footer from './components/Footer'
import './App.scss';
import Header from './components/Header';
import Shit from './components/Shit'
import Prismic from 'prismic-javascript';

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
        this.selectQuantity = this.selectQuantity.bind(this);
		this.addToBasket = this.addToBasket.bind(this);
		this.removeItem = this.removeItem.bind(this);
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

	addToBasket(item) {
		let itemArray = this.state.basket;
        
        if (!itemArray.find(o => o.title === get(item, 'title'))) itemArray.push(item);

        localStorage.setItem('session', JSON.stringify(itemArray));

        const basket = JSON.parse(localStorage.getItem('session'));

        this.setState({ basket })
	}

	selectQuantity(e, item) {
        const quantity = e.target.value;
        this.setState(() => ({
            basket: this.state.basket.map(element => {
                return element.title === item.title ? { ...element, quantity: quantity } : element
        })}), () => localStorage.setItem('session', JSON.stringify(this.state.basket)));
	}

	removeItem(item) {
		this.setState(() => ({
            basket: this.state.basket.filter(element => {
				return element.title !== item.title
        })}), () => localStorage.setItem('session', JSON.stringify(this.state.basket)));
	}

	handleNavigationFilter(item) {
		this.setState({
			filteredProducts: this.state.products.filter(product => product.type === item),
		});

		if (item === 'reset') {
			this.setState({ filteredProducts: false });
		}
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
			});
			
			cardTypes.push(item.type_of_card);
		});

		this.setState({ cardTypes, doc });
	}
	
	render() {
		const { basket, cardTypes, doc, products, filteredProducts } = this.state;
		return ([
			<div className="app">
				<Navigation
					navigationItems={cardTypes}
					handleNavigationFilter={this.handleNavigationFilter}
				/>
				<div style={{ flex: 1, background: '#fff7f5' }}>
					<Header
						title='header'
						shop
						basket={basket}
					/>
					<Router history={history} >
						<Switch>
							<Route exact path="/" render={routeProps =>
								<Page
									{...routeProps}
									prismicCtx={this.props.prismicCtx}
									basket={basket}
									getCardType={this.getCardType}
									doc={doc}
									products={filteredProducts || products}
								/>
							} />

							<Route exact path="/page/:uid" render={routeProps => <Shit {...routeProps} prismicCtx={this.props.prismicCtx} />} />

							<Route exact path="/product" render={routeProps =>
								<Product
									{...routeProps}
									prismicCtx={this.props.prismicCtx}
									addToBasket={this.addToBasket}
									basket={basket}
								/>
							} />

							<Route exact path="/checkout" render={routeProps =>
								<Checkout
									{...routeProps}
									basket={basket}
									prismicCtx={this.props.prismicCtx}
									selectQuantity={this.selectQuantity}
									removeItem={this.removeItem}
								/>
							} />

							<Route exact path="/pay" render={routeProps =>
								<Pay
									{...routeProps}
									basket={basket}
									prismicCtx={this.props.prismicCtx}
									selectQuantity={this.selectQuantity}
									removeItem={this.removeItem}
								/>
							} />

							<Route exact path="/contact" render={routeProps =>
								<Contact />
							} />

							<Route component={NotFound} />
						</Switch>
					</Router>
				</div>
			</div>,
			<Footer />,
		])
	}
};

export default App;
