
import { get, find } from 'lodash';

const updateBasket = (item, update = false, remove = false) => {
    let basket = JSON.parse(localStorage.getItem('session')) || [];

    if (!basket.find(o => o.title === get(item, 'title'))) basket.push(item);

    if (update) {
        const { key, value } = update;
        basket.map(element => {
            if (element.title === item.title) element[key] = value;
        });
    }

    if (remove) basket = basket.filter(element => element.title !== item.title);

    localStorage.setItem('session', JSON.stringify(basket));

    return JSON.parse(localStorage.getItem('session'));
}

export default updateBasket;