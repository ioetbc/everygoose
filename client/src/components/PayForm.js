import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import moment from 'moment';

class PayForm extends Component {
    constructor(props) {
        super(props);
        this.state = { firstName: '', lastName: '' }

        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
    }

    // TODO add in validation to all inputs

    handleFirstName(e) {
        this.setState({ firstName: e.target.value });
    }

    handleLastName(e) {
        this.setState({ lastName: e.target.value });
    }

    getEstimatedDelivery() {
        const weekday = moment().weekday();
        const time = moment().format('H')

        if (weekday < 6 || time < 14) {
            return moment().add(2, 'day').format('Do MMMM');
        } else {
            return moment().add(4, 'day').format('Do MMMM');
        }
    }
    
    handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { token } =  await this.props.stripe.createToken({ name: this.state.FirstName })

            const amount = this.props.basket.reduce((a, item) =>  item.price * item.quantity + a, 0) + this.props.deliveryCost;

            const currency = 'GBP'

            const quantity = this.props.basket.reduce((a, item) => parseInt(item.quantity, 10) + a, 0);

            const estimatedDelivery = this.getEstimatedDelivery();

            await fetch('/api/hello', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    amount,
                    currency,
                    firstName: this.state.firstName,
                    quantity,
                    estimatedDelivery
                }),
            });

        } catch(e) {
            console.log('whats error', e)
            throw e;
        }
    }

    render() {
        console.log(this.props.deliveryCost)
        return (
            <form onSubmit={(e) => this.handleSubmit(e)}>
                <label>first name</label>
                <input
                    type="text"
                    placeholder="first name"
                    value={this.state.firstName}
                    onChange={(e) => this.handleFirstName(e)}
                ></input>
    
                <label>last name</label>
                <input
                    type="text"
                    placeholder="last name"
                    value={this.state.lastName} 
                    onChange={(e) => this.handleLastName(e)}
                ></input>

                <label>card number / expiry date / security code</label>
                <CardElement />

                <button type="submit">pay now</button>
            </form>
        );
    }
}

export default injectStripe(PayForm);