import React, { Component } from 'react';
import Prismic from 'prismic-javascript';

import ScrollToTop from '../components/utils/ScrollTop';
import profileImage from '../images/profile-image.jpg';

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
                <img style={{ width: '100%', maxWidth: '400px' }} src={profileImage} />
                <p>{this.state.aboutContent}</p>
            </main>
        ];
    }
}

export default About;