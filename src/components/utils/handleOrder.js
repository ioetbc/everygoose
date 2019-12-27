
import axios from 'axios';
import estimatedDelivery from './EstimatedDelivery';
import uuid from 'uuid/v4';

const handleOrder = async (payload, paymentMethod) => {
    console.log('payload', payload);  
    const basket = JSON.parse(localStorage.getItem('session')) || [];

    const emailQuantityAndTitle = basket.map(a => {
        return {
            quantity: a.quantity,
            title: a.title,
        }
    });

    const quantity = parseInt(basket.map(i => i.quantity)[0], 10);

    let theyOrIt;
    let cardOrCards;
    if (quantity < 2 && basket.length === 1) {
        theyOrIt = 'It'
        cardOrCards = 'card'
    } else {
        theyOrIt = 'They'; 
        cardOrCards = 'cards'
    }

    const data = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        addressFirst: payload.addressFirst,
        addressSecond: payload.addressSecond,
        addressThird: payload.addressThird,
        city: payload.city,
        county: payload.county,
        postcode: payload.postcode,
        phoneNumber: payload.phoneNumber,
        paymentMethod: 'stripe',
        basket,
        cardOrCards,
        theyOrIt,
        breakdown: emailQuantityAndTitle,
        estimatedDelivery: estimatedDelivery(),

    }

    if (paymentMethod === 'paypal') {
        data.paymentMethod = 'paypal';
    } else {
        Object.assign(data, {
            stripeToken: payload.stripeToken,
            idempotencyKey: uuid(),
        })
    }

    console.log('data', data);

    await axios({
        method: 'post',
        url: process.env.REACT_APP_PAY_ENDPOINT,
        config: {
            headers: {
                'Content-Type': 'application/json'
            }
        },
        data,
    })
    .then((res) => {
        // this.setState({ isLoading: false });
       return  window.location=`${res.data}`
    })
    .catch((error) => {
        // this.setState({ isLoading: false });
        return window.location=`${error.data}`
    });
};

export default handleOrder;