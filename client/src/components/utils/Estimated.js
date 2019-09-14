import moment from 'moment';

export default function EstimatedDelivery() {
    const weekday = moment().weekday();
    const time = moment().format('H')

    console.log('weekday', weekday);

    if (weekday < 6 || time < 14) {
        return moment().add(2, 'day').format('Do MMMM');
    } else {
        return moment().add(4, 'day').format('Do MMMM');
    }
}