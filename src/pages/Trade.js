import React, { Component } from 'react';
import Prismic from 'prismic-javascript';
import { Link } from 'react-router-dom';

import Button from '../components/Shared/Button';
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
            this.setState({ tradeContent: doc.data.trade.map(p => <p style={{ marginBottom: '24px' }}>{p.text}</p>) });   
        }
	}
    
    render() {
        return [
            <ScrollToTop />,
            <main className="main-content">
                <div style={{ marginBottom: '24px' }} className="content-more-right-less-left">
                    <p>{this.state.tradeContent}</p>
                </div>
                <Link to={{ pathname: "/contact"}}>
                            <Button
                                text="ask a question"
                            />
                    </Link> 
            </main>,
        ];
    }
}

export default Trade;