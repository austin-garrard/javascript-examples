import {confirm, Order} from './order';
import {Tacos} from './taco';
import {OrderNumberSequenceGenerator} from './orderNumberSequenceGenerator';

describe('order', () => {
  it('combines total prices of items', () => {
    const order = Order();
    const taco1 = Tacos.AL_PASTOR;
    const taco2 = Tacos.BARBACOA;
    order.add(taco1);
    order.add(taco2);

    expect(order.totalPrice()).toEqual(8.71);
  });

  describe('confirmation', () => {
    it('maintains the total price', () => {
      const order = Order();
      const taco1 = Tacos.AL_PASTOR;
      const taco2 = Tacos.BARBACOA;
      order.add(taco1);
      order.add(taco2);

      const confirmedOrder = confirm(order);

      expect(confirmedOrder.totalPrice()).toEqual(8.71);
    });

    it('cannot change the order', () => {
      const confirmedOrder = confirm(Order());

      expect(() => confirmedOrder.add(Tacos.AL_PASTOR)).toThrow();
    });

    it('assigns an order number', () => {
      spyOn(OrderNumberSequenceGenerator, 'next').and.returnValue(101);
      const confirmedOrder = confirm(Order());

      expect(confirmedOrder.number()).toEqual(101);
    });

    it('only increments the order number once', () => {
      spyOn(OrderNumberSequenceGenerator, 'next').and.returnValues(101, 102, 103);
      const confirmedOrder = confirm(Order());

      expect(confirmedOrder.number()).toEqual(101);
      expect(confirmedOrder.number()).toEqual(101);
    });

    it('gives the itemized receipt', () => {

    });
  });
});