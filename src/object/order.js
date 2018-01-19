import {OrderNumberSequenceGenerator} from './orderNumberSequenceGenerator';

export function Order() {
  let _items = [];

  return {
    add(item) {
      _items.push(item);
    },

    totalPrice() {
      return _items.reduce((totalPrice, item) => totalPrice + item.totalPrice(), 0);
    },

    items() {
      return _items;
    }
  };
}

export function confirm(order) {
  const number = OrderNumberSequenceGenerator.next();
  const items = order.items();

  return {
    totalPrice: order.totalPrice,

    number() {
      return number;
    },

    receipt() {
      const header = 'Order #' + number + '\n';
      const lineItems = items.reduce((lineItems, item) => lineItems + '\t' + item.receiptName() + '\t' + item.rawPrice() + '\n', '');
      const tax = 'Tax:\t' + items.reduce((totalTax, item) => totalTax + item.taxes(), 0);
      const total = 'Total:\t' + items.reduce((total, item) => total + item.totalPrice(), 0);

      return header + lineItems + tax + '\n' + total + '\n';
    }
  }
}