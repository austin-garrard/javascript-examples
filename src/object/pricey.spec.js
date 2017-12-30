import {pricey, Taxes} from './pricey';

describe('pricey', () => {
  it('has a raw price', () => {
    const thing = pricey({}, {
      price: 10
    });

    expect(thing.rawPrice()).toEqual(10.00);
  });

  it('has ny sales tax by default', () => {
    const thing = pricey({}, {
      price: 10
    });

    expect(thing.totalPrice()).toEqual(10.8875);
  });

  it('combines the given tax rates', () => {
    const thing = pricey({}, {
      price: 10,
      taxes: [Taxes.SALES_NY, .1]
    });

    expect(thing.totalPrice()).toEqual(11.8875);
  });
});
