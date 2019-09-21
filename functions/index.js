const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const uuid = require('uuidv4').default;

admin.initializeApp({
    apiKey: functions.config().db.api_key,
    authDomain: functions.config().db.auth_domain,
    databaseURL: functions.config().db.url,
    projectId: functions.config().db.project_id,
    messagingSenderId: functions.config().db.message_sender_id,
    appId: functions.config().db.app_id,
    storageBucket: functions.config().db.storage_bucket,
});

const db = admin.firestore();

exports.payment = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {

        
















        const customer_id = uuid();
        const payload = {
            outer: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email, 
                items: req.body.items,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber
            }
        }
    
        console.log('req.body', req.body);
        console.log('payload', payload);
    
        db.collection("customers").doc(customer_id).set(payload)
            .then(() => {
                return console.log('customer creation');
            })
            .catch((error) => console.log('error creating customer', error));
    
        return res.send('newwwwww to the db');
    });
});