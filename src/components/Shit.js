import React from 'react';
import Prismic from 'prismic-javascript'

 export default class Page extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			doc: null,
			notFound: false,
		}
		if (props.prismicCtx) {
			this.fetchPage(props);
		}
	}

 	componentDidUpdate(prevProps) {
		this.props.prismicCtx.toolbar();
		if (!prevProps.prismicCtx) {
			this.fetchPage(this.props);
		}
	}

 	async fetchPage() {
		const client = Prismic.client('https://everygoose.prismic.io/api/v2')
		const doc = await client.getByID('XRKGLREAABMqpN_7');

		this.setState({ doc });
	}

 	render() {
		if (this.state.doc) {
		
		  return (
				<div>{this.state.doc.data.product.link_type}</div>
		  );
		}
		return <h1>Loading</h1>;
	}
}