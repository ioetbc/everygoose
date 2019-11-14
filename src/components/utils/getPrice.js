export default function getPrice(basket) {
    const total = (basket.reduce((a, item) =>  item.price * item.quantity + a, 0));   
    return total;
}