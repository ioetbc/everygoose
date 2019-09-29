import React, { Component } from 'react';
import Prismic from 'prismic-javascript';

import ScrollToTop from '../components/utils/ScrollTop';

class Trade extends Component {
    constructor(props) {
        super(props);
        this.state = {
			tradeContent: '',
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
			.getByID('XXxIZxAAACUAJDr8');
        if (doc) {
            this.setState({ tradeContent: doc.data.trade[0].text })
        }
	}
    
    render() {
        return [
            <ScrollToTop />,
            <main className="main-content">
                <div className="content-more-right-less-left">
                    <p>{this.state.tradeContent}</p>
                </div>
            </main>,
        ];
    }
}

export default Trade;