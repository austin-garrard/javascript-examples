import {OrderNumberSequenceGenerator} from './orderNumberSequenceGenerator';

export function Order() {
  let _items = [];

  return {
    add(item) {
      _items.push(item);
    },

    totalPrice() {
      return _items.reduce((totalPrice, item) => totalPrice + item.totalPrice(), 0);
    }
  };
}

export function confirm(order) {
  const number = OrderNumberSequenceGenerator.next();

  return {
    totalPrice: order.totalPrice,

    number() {
      return number;
    },

    receipt() {

    }
  }
}