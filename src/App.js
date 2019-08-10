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
import NotFound from './pages/NotFound';
import Navigation from './components/Navigation';
import Footer from './components/Footer'
import './App.scss';
import Header from './components/Header';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { basket: JSON.parse(localStorage.getItem('session')) || [] }
        this.selectQuantity = this.selectQuantity.bind(this);
		this.addToBasket = this.addToBasket.bind(this);
		this.removeItem = this.removeItem.bind(this);
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
	
	render() {
		const { basket } = this.state;

		return ([
			<div className="app">
				<Navigation />
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
								/>
							} />

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
