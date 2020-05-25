const chunkProducts = (products) => {
    // how many chunks
    const chunks = Math.ceil(products.length / 20);
    console.log('chunks', chunks);

    const pages = [{}, {}, {}, {}, {}];
    const hmm = Math.ceil(products.length / chunks);
    console.log('hmm', hmm)
    products.map((p, index) => {
        if (index % 20 === 0) { 
            pages.splice(0, p);
        } else {

        }
    })
    console.log('pages', pages)


};

export default chunkProducts;