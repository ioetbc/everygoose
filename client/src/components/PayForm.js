import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';

class PayForm extends Component {
    constructor(props) {
        super(props);
        this.state = { firstName: '', lastName: '', amount: 2 }

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
    
    handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { token } =  await this.props.stripe.createToken({ name: this.state.FirstName })
            const amount = this.state.amount;
            const currency = 'GBP'

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
                    items: this.props.basket,
                }),
            });

        } catch(e) {
            console.log('whats error', e)
            throw e;
        }
    }

    render() {
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