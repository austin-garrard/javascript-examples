import {ColorService} from './one';

describe('promise', () => {
  it('gives a value to a function', (done) => {
    Promise.resolve({some: 'value'})
      .then(value => {
        expect(value).toEqual({some: 'value'})
      })
      .finally(done)
  });

  it('values returned from a then function are given to the next then function', (done) => {
    Promise.resolve('1')
      .then(value => {
        return '2';
      })
      .then(value => {
        expect(value).toEqual('2');
      })
      .finally(done)
  });

  it('then functions are executed in order', (done) => {
    let colors = [];

    Promise.resolve('purple')
      .then(value => {
        colors.push(value);
        colors.push('blue');
      })
      .then(value => {
        colors.push('green');
      })
      .then(value => {
        expect(colors).toEqual(['purple', 'blue', 'green']);
      })
      .finally(done)

  });

  it('values resolved by promises returned from a then function are given to the next then function', (done) => {
    Promise.resolve('value')
      .then(value => {
        return Promise.resolve('purple')
      })
      .then(value => {
        expect()
      })
      .finally(done)
  })

  it('is asynchronous', (done) => {
    Promise.resolve('value')
      .then(value => {
        let delayMs = 1000;
        return new Promise(resolve => setTimeout(resolve, delayMs, 'delayed'));
      })
      .then(value=> {
        expect(value).toEqual('delayed');
      })
      .finally(done)
  });

  it('catches errors', (done) => {
    Promise.resolve('value')
      .then(value => {
        null.anyoneHome();
      })
      .catch(error => {
        expect(error.name).toEqual('TypeError');
        expect(error.message).toEqual('Cannot read property \'anyoneHome\' of null');
      })
      .finally(done)
  });
});

describe('ColorService', () => {
  let colorService;

  beforeEach(() => {
    colorService = new ColorService();
  });

  it('looks up an address', () => {
    colorService.getColors()
      .then(json => {
        expect(json).toEqual('hi');
      });
  })
});