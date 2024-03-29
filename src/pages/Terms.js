import React, { Component } from 'react';
import Prismic from 'prismic-javascript';

import ScrollToTop from '../components/utils/ScrollTop';

class Terms extends Component {
    constructor(props) {
        super(props);
        this.state = {
			termsContent: '',
		}

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
		const doc = await Prismic.client('https://everygoose.prismic.io/api/v2')
			.getByID('XXq3vBAAACUAHSd9');
        if (doc) {
            this.setState({
                termsContent: doc.data.main.map(p => <p style={{ marginBottom: '24px' }}>{p.text}</p>),
            })
        }
	}
    
    render() {
        return [
            <ScrollToTop />,
            <main className="main-content">
                <div className="content-more-right-less-left">
                    <p>{this.state.termsContent}</p>
                </div>
            </main>,
        ];
    }
}

export default Terms;