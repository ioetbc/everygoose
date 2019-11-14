import validateSingle from '../validateSingle';

const errorInput = {
    target: {
		name: 'firstName',
		value: 'f',
    }
}

const successInput = {
    target: {
		name: 'firstName',
		value: 'william',
    }
}

it('validates form and throws error if user input value is invalid', () => {
	const error = validateSingle(errorInput);
    expect(error.error).toEqual(true);
});

it('validates form and DOES NOT throw error if user input value is valid', () => {
	const error = validateSingle(successInput);
    expect(error).toBeUndefined();
});
