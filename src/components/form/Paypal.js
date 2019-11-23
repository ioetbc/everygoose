import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';

class Paypal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showButton: false,
		};
  	}

	render() {
		return (
			<p>paypal</p>
		)
	}
}

export default scriptLoader('https://www.paypal.com/sdk/js?client-id=sb')(Paypal);