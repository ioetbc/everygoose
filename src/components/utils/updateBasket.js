
import { get, find } from 'lodash';

const updateBasket = (item, option = false) => {
    // const OGBasket = JSON.parse(localStorage.getItem('session')) || [];

    const currentBasket = [];

    console.log('the original basket', currentBasket);
    console.log('item', item);
    console.log('option', option);

    const newItem = currentBasket.find(o => o.title === get(item, 'title'));
    if (newItem) currentBasket.push(item)

    const hello = localStorage.setItem('session', JSON.stringify(currentBasket));

    // const updatedBasket = localStorage.setItem('session', JSON.stringify(updatedBasket));

    console.log('hello', hello); 

    return hello;
}

// const updatedItem = !basket.find(o => o.framed === get(item, 'framed'));
// else if (updatedItem) {
//     const updateItem = basket.find(o => o.title === get(item, 'title'));
//     updateItem.framed = option;
// }

// selectQuantity(e, item) {
//     const quantity = e.target.value;
//     this.setState(() => ({
//         basket: this.state.basket.map(element => {
//             return element.title === item.title ? { ...element, quantity: quantity } : element
//     })}), () => localStorage.setItem('session', JSON.stringify(this.state.basket)));
// }

// removeItem(item) {
//     this.setState(() => ({
//         basket: this.state.basket.filter(element => {
//             return element.title !== item.title
//     })}), () => localStorage.setItem('session', JSON.stringify(this.state.basket)));
// }

export default updateBasket;