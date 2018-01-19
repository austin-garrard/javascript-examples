
export const Taxes = {
  SALES_NY: .08875
};

export function pricey(object, params) {
  let _price = params['price'] || 0;
  let _taxes = params['taxes'] || [Taxes.SALES_NY];

  return Object.assign(object, {
    withPrice(price) {
      _price = price;
      return this;
    },

    rawPrice() {
      return _price;
    },

    taxes() {
      return _taxes.reduce((allTaxes, tax) => allTaxes + (tax * _price), 0);
    },

    totalPrice() {
      return _price + this.taxes();
    }
  });
}