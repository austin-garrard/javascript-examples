import {OrderNumberSequenceGenerator} from './orderNumberSequenceGenerator'
import {Order} from './order';

export const OrderFactory = {
  create() {
    return Order(OrderNumberSequenceGenerator.next());
  }
};
