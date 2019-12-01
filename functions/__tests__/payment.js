const test = require('firebase-functions-test')();
test.mockConfig({ stripe: { secret_key: '123' }});
const payment = require('../index');

describe('if validation fails', () => {
    it('throws error', () => {
        const badPayload = {
            body: {
                firstName: '',
            }
        }
        payment(badPayload);
    });
});


