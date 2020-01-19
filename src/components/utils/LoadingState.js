const loadingState = () => {
    const app = document.getElementsByClassName('app')[0];
    const newDiv = document.createElement('div');
    const spinner = document.createElement('div');

    newDiv.classList.add('is-loading');
    spinner.classList.add('loading-spinner');
    app.after(newDiv);
    newDiv.after(spinner);
}

export default loadingState;