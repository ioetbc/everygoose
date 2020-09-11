import axios from 'axios';
import estimatedDelivery from './EstimatedDelivery';
import { BasketHandler } from './updateBasketV2';
import uuid from 'uuid/v4';

const handleOrder = async (payload, paymentMethod) => {
    const basket = JSON.parse(localStorage.getItem('session')) || [];
    const inputs = [...document.getElementsByTagName('input')];
    inputs.map(i => i.value = '');

    const emailQuantityAndTitle = basket.map(a => {
        return {
            quantity: a.quantity,
            title: a.title,
        }
    });

    const quantity = parseInt(basket.map(i => i.quantity)[0], 10);

    // TODO put this in the email function 
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
        addressFirst: payload.addressFirstLine,
        addressSecond: payload.addressSecondLine,
        addressThird: payload.addressThirdLine,
        country: payload.country,
        // TODO dont send this whole array through get it on the backend
        europeanCountries: payload.europeanCountries,
        city: payload.city,
        county: payload.county,
        postcode: payload.postcode,
        phoneNumber: payload.phone,
        paymentMethod: 'stripe',
        basket,
        cardOrCards,
        theyOrIt,
        breakdown: emailQuantityAndTitle,
        estimatedDelivery: estimatedDelivery(),
        productCodes: basket.map(i => i.product_code),
    }

    if (paymentMethod === 'paypal') {
        data.paymentMethod = 'paypal';
        Object.assign(data, {
            orderID: payload.orderID,
        });
    } else {
        Object.assign(data, {
            stripeToken: payload.stripeToken,
            idempotencyKey: uuid(),
        })
    }

    return axios({
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
        const basketHandler = new BasketHandler({});
        basketHandler.blat();
        return res;
    })
    .catch((error) => {
        return error;
    });
};

export default handleOrder;
