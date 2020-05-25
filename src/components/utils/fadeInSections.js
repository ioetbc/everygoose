const fadeInSections = fetchProducts => {
    const sections = document.querySelector('.footer');
    const options = {
        threshold: 1,
        rootMargin: '300px',
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(element => {
            if (element.isIntersecting) fetchProducts();
        });
    }, options);

    observer.observe(sections);
}

export default fadeInSections;