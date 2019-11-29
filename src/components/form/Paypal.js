import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';

class Paypal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showButton: false,
		};
	  }
	  
	componentDidMount() {
		window.paypal.Buttons({
			createOrder: function(data, actions) {
			  // This function sets up the details of the transaction, including the amount and line item details.
			  return actions.order.create({
				purchase_units: [{
				  amount: {
					value: '0.01'
				  }
				}]
			  });
			},
			onApprove: function(data, actions) {
				// This function captures the funds from the transaction.
				return actions.order.capture().then(function(details) {
				  // This function shows a transaction success message to your buyer.
				  alert('Transaction completed by ' + details.payer.name.given_name);
				  return fetch('/paypal-transaction-complete', {
					method: 'post',
					headers: {
					  'content-type': 'application/json'
					},
					body: JSON.stringify({
					  orderID: data.orderID
					})
				  });
				});
			  },
			  locale: 'en_GB',
			  style: {
				layout:  'horizontal',
				shape:   'rect',
				label:   'paypal',
				tagline: false,
			  }
			
		  }).render('#paypal-button-container');
	}

	render() {
		return (
			<div style={{ marginBottom: '24px' }} id="paypal-button-container"></div>
		)
	}
}

export default Paypal;