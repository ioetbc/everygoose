import React, { Component } from 'react';
import Prismic from 'prismic-javascript';

import ScrollToTop from '../components/utils/ScrollTop';

class Delivery extends Component {
    constructor(props) {
        super(props);
        this.state = { deliveryContent: '' }

		if (this.props.prismicCtx) {
			this.fetchPage(props);
		}
    }

    componentDidUpdate(prevProps) {
		if (!prevProps.prismicCtx) {
			this.fetchPage(this.props);
		}
    }

    async fetchPage() {

        Prismic.client('https://everygoose.prismic.io/api/v2').query('').then(res => {
            console.log('res', res)
        })

		const doc = await Prismic.client('https://everygoose.prismic.io/api/v2')
			.getByID('XXxJixAAACMAJEAT');
        if (doc) {
            this.setState({ deliveryContent: doc.data.delivery_and_returns[0].text });
        }
	}
    
    render() {
        return [
            <ScrollToTop />,
            <main className="main-content">
                <div className="content-more-right-less-left">
                    <p>{this.state.deliveryContent}</p>
                </div>
            </main>,
        ];
    }
}

export default Delivery;