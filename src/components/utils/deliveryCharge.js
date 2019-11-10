export default function deliveryCharge(products, country) {

    console.log('prddddddoducts', products)
    console.log('couddddddntry', country)


    // const allCharges = products.map(p => {
    //     const type = p.product_type;

    //     if (type === 'bundle') {
    //         return 4;
    //     } else if (type === 'print') {
    //         return 2;
    //     } else {
    //         return 1;
    //     }
    // });
    // return Math.max(...allCharges);
}


// const deliveryCharge = total > 35 ? 0 : 2;
// const deliveryPricing = [
//     {
//         cards: {
//             uk: 1,
//             europe: 2,
//             ROW: 2.50
//         }
//     },
//     {

//         prints: {
//             uk: 2,
//             europe: 3,
//             ROW: 3,
//         }
//     },
//     {
//         bundles: {
//             uk: 3,
//             europe: 4,
//             ROW: 5,
//         }
//     },
// ];