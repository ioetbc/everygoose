
class BasketHandler {
    constructor({ item, node, basket, store }) {
      this.item = item;
      this.node = node;
      this.basket = basket;
      this.store = store;   
    }

    add() {
        if (!this.basket.find(o => o.title === this.item.title)) this.basket.push(this.item);
        localStorage.setItem('session', JSON.stringify(this.basket));

        return this.basket;
    }
  
    update() {
      const { key, value } = this.node;

        if (this.basket.find(i => i.title === this.item.title)) {
            this.basket.map(i => {
                if (i.title === this.item.title) {
                    i[key] = value;
                }
            });
        }
// removed store if statement 
        localStorage.setItem('session', JSON.stringify(this.basket));

        return this.basket;
    }

    remove() {
        this.basket = this.basket.filter(i => i.title !== this.item.title);
        localStorage.setItem('session', JSON.stringify(this.basket));
        return this.basket;
    }

    blat() {
        this.basket = [];
        localStorage.setItem('session', JSON.stringify(this.basket));
        return this.basket;
    }
  
}

export { BasketHandler }
