import React, { Component } from 'react';

import ScrollToTop from '../components/utils/ScrollTop';

class Contact extends Component {
    constructor(props) {
        super(props); 
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'will',
                    email: 'hello@gmail.com',
                    phoneNumber: '07493774943', 
                    message: 'wow this email is sent on submission of the contact form'
                }),
            });
    
        } catch(e) {
            console.log(e, 'error sending message')
            throw e;
        }
    }

    render() {
        return [
            <ScrollToTop />,
            <main className="main-content" style={{ display: 'flex', justifyContent: 'center' }}>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input className='text-field--input' name="Name" id="name" placeholder=' ' type='text' />
                            <label className='text-field--label' for='name'>Name</label>
                        </div>
                    </div>
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input className='text-field--input' name="Email address" id="email" placeholder=' ' type='email' />
                            <label className='text-field--label' for='email'>Email address</label>
                        </div>
                    </div>
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input className='text-field--input' name="phone number" id="phone" placeholder=' ' type='number' />
                            <label className='text-field--label' for='phone'>Phone number</label>
                        </div>
                    </div>
                    <div className='text-field--container'>
                        <div className='text-field'>
                            <input className='text-field--input' name="Message" id="message" placeholder=' ' type='text' />
                            <label className='text-field--label' for='message'>Message</label>
                        </div>
                    </div>
                    <button class="pure-material-button-contained">submit</button>
                </form>
            </main>,
        ]
    }
}

export default Contact;