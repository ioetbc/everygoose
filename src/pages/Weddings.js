import React, { Component } from 'react';
import Prismic from 'prismic-javascript';

import ScrollToTop from '../components/utils/ScrollTop';
import profileImage from '../images/profile-image.jpg';
import SlideShow from '../components/SlideShow';

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
            console.log('yay', response)
            console.log('yay', response.results[0].data.main_content[0].text)
            console.log('yay', response.results[0].data.image_1)
            return response;
        });
        
        this.setState({
            aboutContent: res.results[0].data.main_content[0].text,
            slideshowImages: [res.results[0].data.image_1.url, res.results[0].data.image_2.url, res.results[0].data.image_3.url, res.results[0].data.image_4.url, res.results[0].data.image_5.url]
        });
    }
    
    // TODO add in contact button that launches weddings modal

    render() {
        console.log('aboutContent', this.state.aboutContent)
        return [
            <ScrollToTop />,
            <main className="content-side-by-side" style={{ marginTop: '60px' }}>
                <SlideShow
                    slideshowImages={this.state.slideshowImages}
                />
                <p>{this.state.aboutContent}</p>
            </main>
        ];
    }
}

export default Weddings;