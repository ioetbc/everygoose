<div data-wio-id={this.state.doc.id}>
{/* This is how to get an image into your template */}
<img alt="cover" src={this.state.doc.data.image.url} />
{/* This is how to insert a Rich Text field as plain text */}
<h1>{PrismicReact.RichText.asText(this.state.doc.data.title)}</h1>
{/* This is how to insert a Rich Text field into your template as html */}
{PrismicReact.RichText.render(this.state.doc.data.description, this.props.prismicCtx.linkResolver)}
</div>