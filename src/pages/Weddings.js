import React, { Component } from 'react';
import Prismic from 'prismic-javascript';

import ScrollToTop from '../components/utils/ScrollTop';
import SlideShow from '../components/SlideShow';
import Button from '../components/Shared/Button';
import { Link } from 'react-router-dom';

class Weddings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aboutContent: '',
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
		const res = await Prismic.api("https://everygoose.prismic.io/api/v2").then(function(api) {
			return api.query(
			[ Prismic.Predicates.at('document.tags', ['weddings'])], 
			{ pageSize : 25, page : 1 }
			);
		}).then(function(response) {
            return response;
        });
        
        this.setState({
            // aboutContent: res.results[0].data.main_content[0].text,
            aboutContent: res.results[0].data.main_content.map(p => <p style={{ marginBottom: '24px' }}>{p.text}</p>),
            slideshowImages: [res.results[0].data.image_1.url, res.results[0].data.image_2.url, res.results[0].data.image_3.url, res.results[0].data.image_4.url, res.results[0].data.image_5.url]
        });
    }

    render() {
        return [
            <ScrollToTop />,
            <main className="content-side-by-side" style={{ marginTop: '60px' }}>
                <SlideShow
                    slideshowImages={this.state.slideshowImages}
                />
                <div>
                    <p style={{ marginBottom: '24px' }}>{this.state.aboutContent}</p>
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

export default Weddings;