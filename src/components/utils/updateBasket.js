
import { get, includes } from 'lodash';

//  UPDATE FROM PRODUCT PAGE
const updateBasket = (item, update = false, remove = false, blat = false) => {
    let basket = JSON.parse(localStorage.getItem('session')) || [];

    if (!basket.find(o => o.title === get(item, 'title'))) basket.push(item);

    if (update) {
        const { key, value } = update;

        if (basket.find(o => o.title === get(item, 'title'))) {
            basket.map(element => {
                if (element.title === item.title) {
                    element[key] = value;
                }
            });
        }
    }

    if (remove) basket = basket.filter(element => element.title !== item.title);

    if (blat) basket = [];

    localStorage.setItem('session', JSON.stringify(basket));

    return JSON.parse(localStorage.getItem('session'));
}

export default updateBasket;