import {Amount, createSalsa, Taco} from './taco';

describe('tacos', () => {
  it('is spicy', () => {
    const salsa = createSalsa(10);
    const amountOfSalsa = Amount(10);

    const taco = Taco('beef', 'corn', salsa, amountOfSalsa);

    expect(taco.spiciness()).toEqual(100);
    expect(taco.isLegit()).toEqual(true);
  });

  it('adds salsa', () => {
    const salsa = createSalsa(10);
    const amountOfSalsa = Amount(10);
    const taco = Taco('beef', 'corn', salsa, amountOfSalsa);

    taco.moreSalsa(Amount(2));

    expect(taco.spiciness()).toEqual(120);
  });

  it('removes salsa', () => {
    const salsa = createSalsa(10);
    const amountOfSalsa = Amount(10);
    const taco = Taco('beef', 'corn', salsa, amountOfSalsa);

    taco.lessSalsa(Amount(5));

    expect(taco.spiciness()).toEqual(50);
  });

  it('removing cilantro makes it not legit', () => {
    const salsa = createSalsa(10);
    const amountOfSalsa = Amount(10);
    const taco = Taco('beef', 'corn', salsa, amountOfSalsa);

    taco.withoutCilantro();

    expect(taco.isLegit()).toEqual(false);
  });

  it('removing onions makes it not legit', () => {
    const salsa = createSalsa(10);
    const amountOfSalsa = Amount(10);
    const taco = Taco('beef', 'corn', salsa, amountOfSalsa);

    taco.withoutOnions();

    expect(taco.isLegit()).toEqual(false);
  });
});
