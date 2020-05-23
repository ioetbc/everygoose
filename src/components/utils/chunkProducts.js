const chunkProducts = (products, chunkSize) => {
    const R = [];
        for (var i = 0; i <= products.length; i += chunkSize)
            R.push(products.slice(i, i + chunkSize));
        return R;
};

export default chunkProducts;