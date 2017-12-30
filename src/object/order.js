let nextOrderNumber = 100;

export function OrderNumberSequenceGenerator() {
  return {
    next() {
      let orderNumber = nextOrderNumber;
      nextOrderNumber += 1;
      return orderNumber;
    }
  }
}

export function OrderFactory(orderNumberSequenceGenerator) {
  return {
    create() {
      return Order(orderNumberSequenceGenerator.next());
    }
  }
}

export function Order(orderNumber) {
  let _items = [];

  return {
    add(item) {
      _items.push(item);
    },

    totalPrice() {
      return _items.reduce((totalPrice, item) => totalPrice + item.totalPrice(), 0);
    },

    number() {
      return orderNumber;
    }
  };
}