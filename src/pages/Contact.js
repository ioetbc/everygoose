import React, { Component } from 'react';
import axios from 'axios';

import { generic, email, message } from '../schema/PaySchema';
import profileImage from '../images/profile-image.jpg';
import ScrollToTop from '../components/utils/ScrollTop';
import Button from '../components/Shared/Button';
import { Link } from 'react-router-dom';

class Contact extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            name: '',
            email: '',
            message: '',
            emailSentSuccess: true,
            emailSent: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    // TODO this probs doesnt work
    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ emailSent: true });
        axios({
            method: 'post',
            url: process.env.REACT_APP_CONTACT_ENDPOINT,
            config: {
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            data: {
                name: this.state.name,
                email: this.state.email,
                message: this.state.message,
            },
        })
        .catch(() => {
            this.setState({ emailSentSuccess: true });
        });
    }

    handleInput(e) {
        e.preventDefault();

        switch(e.target.name) {
            case 'name':
                if (generic.validate({ generic: e.target.value }).error) {
                    this.setState({ nameError: 'Whoops, please check your answer to continue.' })
                } else {
                    this.setState({ name: e.target.value, nameError: false });
                }
            break;
            case 'email':
                if (email.validate({ email: e.target.value }).error) {
                    this.setState({ emailError: 'Whoops, please check your answer to continue.' })
                } else {
                    this.setState({ email: e.target.value, emailError: false });
                }
            break;
            case 'message':
                if (message.validate({ message: e.target.value }).error) {
                    this.setState({ messageError: 'Whoops, please check your answer to continue.' })
                } else {
                    this.setState({ message: e.target.value, messageError: false });
                }
            break
        }
    };

    render() {
        const {
            nameError,
            emailError,
            messageError,
            emailSentSuccess,
            emailSent,
        } = this.state;

        const hasErrors = [...document.getElementsByClassName('error-message')].length > 0;

        let allValid = false;
        if (
            nameError === false &&
            emailError === false &&
            messageError === false &&
            !hasErrors
        ) {
            allValid = true;
        }

        const disableButton = allValid;

        return [
            <ScrollToTop />,
            <main className="content-side-by-side" style={{ marginTop: '60px' }}>
                <img style={{ width: '100%', maxWidth: '400px' }} src={profileImage} />
                {!emailSent ?
                    <form className="content-center" onSubmit={(e) => {
                        e.preventDefault()
                        this.handleSubmit(e, allValid)
                        document.getElementById('submitButton').setAttribute('disabled', 'disabled');
                    }}>

                        <div className='text-field--container'>
                            <div className='text-field'>
                                <input
                                    className='text-field--input'
                                    name="name"
                                    id="name"
                                    placeholder=' '
                                    type='text'
                                    onBlur={(e) => this.handleInput(e)}
                                />
                                <label className='text-field--label' for='name'>Name</label>
                            </div>
                            {nameError && <p className="error-message">{nameError}</p>}
                        </div>

                        <div className='text-field--container'>
                            <div className='text-field'>
                                <input
                                    className='text-field--input'
                                    name="email"
                                    id="email"
                                    placeholder=' '
                                    type='text'
                                    onBlur={(e) => this.handleInput(e)}
                                    style={{ textTransform: 'none' }}
                                />
                                <label className='text-field--label' for='email'>Email address</label>
                            </div>
                            {emailError && <p className="error-message">{emailError}</p>}
                        </div>

                        <div className='text-field--container'>
                            <div className='text-field large'>
                                <textarea
                                    className='text-field--input'
                                    name="message"
                                    id="message"
                                    placeholder=' '
                                    onBlur={(e) => this.handleInput(e)}
                                    style={{ textTransform: 'none' }}
                                />
                                <label style={{ textTransform: 'none' }} className='text-field--label' for='message'>Let us know what you need</label>
                            </div>
                            {messageError && <p className="error-message">{messageError}</p>}
                        </div>

                        <button
                        type="submit"
                        className={`button ${!disableButton && 'disabled'}`}
                        id='submitButton'
                    >
                        pay now
                    </button>
                    </form>
                :
                <div>
                    {emailSentSuccess ? 
                        <p style={{ marginBottom: '24px' }}>Thank you for your enquiry we will aim to get back to you within two working days.</p>
                        :
                        <p style={{ marginBottom: '24px' }}>Unfortunately there was an error sending your enquiry please try again later.</p>
                    }
                   
                    <Link to={{ pathname: "/"}}>
                        <Button
                            text="back to home"
                        />
                    </Link> 
                </div>
                }
            </main>,
        ]
    }
}

export default Contact;