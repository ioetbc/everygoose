import React, { Component } from 'react';
import { get } from 'lodash';

import validateSingle from './validateSingle';

const handleValidationMessage = (e) => {
    e.preventDefault();
    const validate = validateSingle(e);
    const errorMessagePresent = document.getElementById(`error-${e.target.name}`);

    if (get(validate, 'error')) {
        const newNode = document.createElement('div');
            newNode.innerHTML = `<p>${validate.errorMessage}</p>`;
            newNode.classList.add('error-message');
            newNode.setAttribute('id', `error-${e.target.name}`);
        if (!errorMessagePresent) {
            const referenceNode = document.getElementsByName(e.target.name)[0].parentNode;
            referenceNode.after(newNode);
        }
    } else {
        if (errorMessagePresent) errorMessagePresent.parentNode.removeChild(errorMessagePresent);
    }
}

export default handleValidationMessage;