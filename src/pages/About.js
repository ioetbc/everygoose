import React, { Component } from 'react';
import Prismic from 'prismic-javascript';

import ScrollToTop from '../components/utils/ScrollTop';

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
            <main className="main-content">
                <div className="content-more-right-less-left">
                    <p>{this.state.aboutContent}</p>
                </div>
            </main>,
        ];
    }
}

export default About;