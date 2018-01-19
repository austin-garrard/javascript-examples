import {pricey} from './pricey';

export function createSalsa(heat) {
  let _heat = heat;

  return {
    heat() {
      return _heat;
    }
  }
}

export function Amount(value) {
  let _value = value;

  return {
    value() {
      return _value;
    },

    minus(amount) {
      return Amount(_value - amount.value());
    },

    plus(amount) {
      return Amount(_value + amount.value());
    }
  }
}

export function Taco(filling, tortilla, salsa, amountOfSalsa, onions = true, cilantro = true) {
  let _filling = filling;
  let _salsa = salsa;
  let _amountOfSalsa = amountOfSalsa;
  let _tortilla = tortilla;
  let _onions = onions;
  let _cilantro = cilantro;

  return {
    spiciness() {
      return _salsa.heat() * _amountOfSalsa.value();
    },

    withoutOnions() {
      _onions = false;
    },

    withoutCilantro() {
      _cilantro = false;
    },

    isLegit() {
      return _onions && _cilantro;
    },

    moreSalsa(amount) {
      _amountOfSalsa = _amountOfSalsa.plus(amount);
    },

    lessSalsa(amount) {
      _amountOfSalsa = _amountOfSalsa.minus(amount);
    }
  };
}

export const Salsas = {
  MILD: createSalsa(0),
  MEDIUM: createSalsa(10),
  HOT: createSalsa(20)
};

export const Tortillas = {
  CORN: 'corn',
  FLOUR: 'flour'
};

function receiptable(object, params) {
  const name = params['name'];

  return Object.assign(object, {
    receiptName() {
      return name;
    }
  });
}

function cookable(object, params) {

}

function standardTaco(filling) {
  const priceyTaco = pricey(Taco(filling, Tortillas.CORN, Salsas.MEDIUM, Amount(10)), {
    price: 4.00
  });
  return receiptable(priceyTaco, {name: 'Taco - ' + filling})
}

export const Tacos = {
  BARBACOA: standardTaco('Barbacoa'),
  AL_PASTOR: standardTaco('Al Pastor'),
  CHICKEN: standardTaco('Chicken')
};
