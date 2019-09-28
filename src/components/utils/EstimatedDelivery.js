import moment from 'moment';

export default function EstimatedDelivery() {
    const weekday = moment().weekday();
    const friday = weekday === 5;
    const saturday = weekday === 6;
    const sunday = weekday === 7;

    if (friday) {
        return moment().add(5, 'day').format('Do MMMM');
    } else if (saturday) {
        return moment().add(4, 'day').format('Do MMMM');
    } else if (sunday) {
        return moment().add(3, 'day').format('Do MMMM');
    } else {
        return moment().add(2, 'day').format('Do MMMM');
    }
}