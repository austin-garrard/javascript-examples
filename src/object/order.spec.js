import {Order, OrderFactory} from './order';
import {Tacos} from './taco';

describe('order', () => {
  it('combines total prices of items', () => {
    const order = Order(100);
    const taco1 = Tacos.AL_PASTOR;
    const taco2 = Tacos.BARBACOA;
    order.add(taco1);
    order.add(taco2);

    expect(order.totalPrice()).toEqual(8.71);
  });
});