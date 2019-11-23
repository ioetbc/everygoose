
import { get, find } from 'lodash';

const updateBasket = (item) => {
    const basket = JSON.parse(localStorage.getItem('session')) || [];

    if (!basket.find(o => o.title === get(item, 'title'))) basket.push(item);
    localStorage.setItem('session', JSON.stringify(basket));

    const updated = JSON.parse(localStorage.getItem('session'));

    return updated;
}

export default updateBasket;