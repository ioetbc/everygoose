const test = require('firebase-functions-test')();
test.mockConfig({
    stripe: { secret_key: 'secret' },
    sendgrid: { secret_key: 'secret' },
    db: {
        apiKey: 'secret',
        authDomain: 'secret',
        databaseURL: 'secret',
        projectId: 'secret',
        messagingSenderId: 'secret',
        appId: 'secret',
        storageBucket: 'secret',
    }
});
const { payment } = require('../index');
const stripe = require('stripe')();

const validateForm = require('../utils/validateForm');
const createCustomer = require('../utils/createCustomer');
const capturePayment = require('../utils/capturePayment');
const preAuthPayment = require('../utils/preAuthPayment');
const sendEmail = require('../utils/sendEmail');
const admin = require('firebase-admin');
const db = admin.firestore();
const cors = require('cors')({ origin: true });

// jest.mock('../utils/validateForm');
jest.mock('../utils/createCustomer');
jest.mock('../utils/capturePayment');
jest.mock('../utils/preAuthPayment');
jest.mock('../utils/sendEmail');

describe('everything', () => {
    beforeEach(async () => {
        await preAuthPayment.mockClear()
        await jest.clearAllMocks();
    });

    afterEach(async () => {
        await preAuthPayment.mockClear();
    });

    describe.only('if validation fails', () => {
        const errorPayload = {
            body: {
                firstName: '',
                lastName: 'cole',
                email: 'ioetbc@gmail.com',
                addressFirst: '11 wavertree road',
                addressSecond: 'flat 6',
                addressThird: '',
                city: 'winchester',
                county: 'hampshire',
                postcode: 'SO238BA',
                phoneNumber: '07493774943',   
                basket: [
                    {
                        description: "card",
                        price: "2.50",
                        product_dimensions: "10.5cm x 14.8cm",
                        product_type: "card",
                        quantity: "2",
                        title: "Seal of Approval Engagement card",
                        type: "mothers day",
                    }
                ],
                stripeToken: '1234',
                idempotencyKey: '1234',
            }
        };

        payment(errorPayload);
        
        it('does not attempt to pre-auth payment', () => {
            expect(preAuthPayment).not.toHaveBeenCalled();
        });

        it('does not create a customer', () => {
            expect(createCustomer).not.toHaveBeenCalled();
        });

        it('does not attempt to capture payment', () => {
            expect(capturePayment).not.toHaveBeenCalled();
        });
        
        it('does not send an email to the customer or Imogen', () => {
            expect(sendEmail).not.toHaveBeenCalled();
        });

    });
    
    // describe('if validation succeeds but pre-auth payment failed', () => {
    //     const successPayload = {
    //             body: {

    //                 firstName: 'will',
    //                 lastName: 'cole',
    //         email: 'ioetbc@gmail.com',
    //         addressFirst: '11 wavertree road',
    //         addressSecond: 'flat 6',
    //         addressThird: '',
    //         city: 'winchester',
    //         county: 'hampshire',
    //         postcode: 'SO238BA',
    //         phoneNumber: '07493774943',   
    //         basket: [
    //             {
    //                 description: "card",
    //                 price: "2.50",
    //                 product_dimensions: "10.5cm x 14.8cm",
    //                 product_type: "card",
    //                 quantity: "2",
    //                 title: "Seal of Approval Engagement card",
    //                 type: "mothers day",
    //             }
    //         ],
    //         stripeToken: '1234',
    //         idempotencyKey: '1234',
    //     }
    //     };
    
    //     payment(successPayload);

    //     it('rejects payment', () => {
    //         preAuthPayment.mockImplementation(() => { throw new Error(); });
    //         expect(preAuthPayment).toThrow();
    //     });
        
    //     it('does not create a customer', () => {
    //         expect(createCustomer).not.toHaveBeenCalled();
    //     });
        
    //     it('does not attempt to capture payment', () => {
    //         expect(capturePayment).not.toHaveBeenCalled();
    //     });
        
    //     it('does not send an email to the customer or Imogen', () => {
    //         expect(sendEmail).not.toHaveBeenCalled();
    //     });
    // });

    // describe('if creating a customer fails', () => {
    //     const successPayload = {
    //         body: {
    //             firstName: 'will',
    //             lastName: 'cole',
    //             email: 'ioetbc@gmail.com',
    //             addressFirst: '11 wavertree road',
    //             addressSecond: 'flat 6',
    //             addressThird: '',
    //             city: 'winchester',
    //             county: 'hampshire',
    //             postcode: 'SO238BA',
    //             phoneNumber: '07493774943',   
    //             basket: [
    //                 {
    //                     description: "card",
    //                     price: "2.50",
    //                     product_dimensions: "10.5cm x 14.8cm",
    //                     product_type: "card",
    //                     quantity: "2",
    //                     title: "Seal of Approval Engagement card",
    //                     type: "mothers day",
    //                 }
    //             ],
    //             stripeToken: '1234',
    //             idempotencyKey: '1234',
    //         }
    //     };

    //     payment(successPayload);
    //     it('does not create a customer', () => {
    //         db.collection.doc.mockImplementation(() => { throw new Error() });
    //         expect(createCustomer).throw();
    //     });

    //     it('does not attempt to capture payment', () => {
    //         expect(capturePayment).not.toHaveBeenCalled();
    //     });

    //     it('does not send an email to the customer or Imogen', () => {
    //         expect(sendEmail).not.toHaveBeenCalled();
    //     });
    // });
});