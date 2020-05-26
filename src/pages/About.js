import React, { Component } from 'react';
import Prismic from 'prismic-javascript';

import ScrollToTop from '../components/utils/ScrollTop';
import Image from '../images/office-illustration.png';
import JustACard from '../images/just-a-card.png';

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
			aboutContent: '',
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
			.getByID('XXxHZhAAACQAJDaE');
        if (doc) {
            this.setState({ aboutContent: doc.data.about[0].text });
        }
	}
    
    render() {
        return [
            <ScrollToTop />,
            <main className="content-side-by-side" style={{ marginTop: '60px' }}>
                <img style={{ width: '100%', maxWidth: '400px' }} className="about-image" src={Image} />
                <div>
                    <p>{this.state.aboutContent}</p>                
                    <img src={JustACard} style={{ width: '70px', marginTop: '24px' }} />
                </div>
            </main>
        ];
    }
}

export default About; 