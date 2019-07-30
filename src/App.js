import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import Page from './Page';
import NotFound from './NotFound';
import Navigation from './components/Navigation';
import Footer from './components/Footer'
// import 'normalize.css';
import './App.scss';

class App extends Component {
	render() {
		const isDesktop = window.matchMedia('(min-width: 768px)');
		return ([
			<div className="app">
				<Navigation
					isDesktop={isDesktop.matches}
				/>
				<Router>
					<Switch>
					<Route exact path="/" render={routeProps =>
						<Page
							{...routeProps}
							prismicCtx={this.props.prismicCtx}
						/>
					} />
					<Route component={NotFound} />
					</Switch>
				</Router>
			</div>,
			// <Footer />,
		])
	}
};

export default App;
