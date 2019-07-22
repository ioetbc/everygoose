import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Page from './Page';
import Preview from './Preview';
import Help from './Help';
import NotFound from './NotFound';
import Navigation from './components/Navigation';
import './App.scss';

const App = (props) => (
	<div className="app">
		<Navigation />
		<main className="main-content">
			<Router>
				<Switch>
				<Redirect exact from="/" to="/help"/>
				<Route exact path="/help" component={Help} />
				<Route exact path="/preview" render={routeProps => <Preview {...routeProps} prismicCtx={props.prismicCtx} />} />
				<Route exact path="/page/:uid" render={routeProps => <Page {...routeProps} prismicCtx={props.prismicCtx} />} />
				<Route component={NotFound} />
				</Switch>
			</Router>
		</main>
	</div>
);

export default App;
