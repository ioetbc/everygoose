import React, { Component } from 'react';
import Prismic from 'prismic-javascript';
import { Link } from 'react-router-dom';

import Button from '../components/Shared/Button';
import ScrollToTop from '../components/utils/ScrollTop';
import SlideShow from '../components/SlideShow';

class Trade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tradeContent: '',
            slideshowImages: []
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
            console.log('doc', doc)
            this.setState({
                tradeContent: doc.data.trade.map(p => <p style={{ marginBottom: '24px' }}>{p.text}</p>),
                slideshowImages: [doc.data.image_1.url, doc.data.image_2.url, doc.data.image_3.url, doc.data.image_4.url, doc.data.image_5.url]
            });   
        }
	}
    
    render() {
        console.log('slideshowImages', this.state.slideshowImages)
        return [
            <ScrollToTop />,
            <main className="content-side-by-side" style={{ marginTop: '60px' }}>
                <SlideShow
                    slideshowImages={this.state.slideshowImages}
                />
                <div>
                    <p>{this.state.tradeContent}</p>
                    <Link to={{ pathname: "/contact"}}>
                            <Button
                                text="ask a question"
                            />
                    </Link> 
                </div>
            </main>
        ];
    }
}

export default Trade;