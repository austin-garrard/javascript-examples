describe('promise', () => {
  it('gives a value to a handler', (done) => {
    Promise.resolve({some: 'value'})
      .then(value => {
        expect(value).toEqual({some: 'value'})
      })
      .finally(done)
  });

  it('values returned from a then handler are given to the next then function', (done) => {
    Promise.resolve('1')
      .then(value => {
        return '2';
      })
      .then(value => {
        expect(value).toEqual('2');
      })
      .finally(done)
  });

  it('then handlers are executed in order', (done) => {
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

  it('values resolved by promises returned from a then handler are given to the next then function', (done) => {
    Promise.resolve('value')
      .then(value => {
        return Promise.resolve('purple')
      })
      .then(value => {
        expect(value).toEqual('purple');
      })
      .finally(done)
  });

  it('is asynchronous', (done) => {
    Promise.resolve('value')
      .then(value => {
        let delayMs = 1000;
        return new Promise(resolve => setTimeout(resolve, delayMs, 'delayed'));
      })
      .then(value => {
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

  it('values returned from catch handlers are given to the next handler', (done) => {
    Promise.resolve('value')
      .then(value => {
        null.anyoneHome();
      })
      .catch(error => {
        return 'i wish someone was home but ok';
      })
      .then(value => {
        expect(value).toEqual('i wish someone was home but ok');
      })
      .finally(done);
  });

  it('catches the values of rejected promises', (done) => {
    Promise.resolve('value')
      .then(value => Promise.reject(new Error('whoops')))
      .then(() => {
        console.log('this is skipped');
        expect(true).toEqual(false);
      })
      .catch(error => {
        expect(error.message).toEqual('whoops');
      })
      .finally(done)
  });

  it('catches the values of thrown errors', (done) => {
    Promise.resolve('value')
      .then(value => {
        throw new Error('whoops');
      })
      .then(() => {
        console.log('this is skipped');
        expect(true).toEqual(false);
      })
      .catch(error => {
        expect(error.message).toEqual('whoops');
      })
      .finally(done)
  });

  it('errors returned from then handlers are treated as resolved values, not rejections or thrown errors', (done) => {
    Promise.resolve('value')
      .then(value => new Error('whoops'))
      .then(error => {
        expect(error.message).toEqual('whoops');
      })
      .catch(error => {
        console.log('this is skipped');
        expect(true).toEqual(false);
      })
      .finally(done)
  });

  describe('some peculiarities with jasmine', () => {
    describe('these tests pass because no expectations are executed', () => {
      it('no catch handler', (done) => {
        Promise.resolve()
          .then(() => {
            null.oops();
          })
          .then(() => {
            expect(false).toEqual(true);
          })
          .finally(done)
      });

      it('catch handler with non-exhaustive expectations', (done) => {
        Promise.resolve()
          .then(() => {
            null.oops();
          })
          .catch(() => {
            return 'i\'m ok with this'
          })
          .finally(done)
      });

      it('catch handler that isnt executed', (done) => {
        const shouldThrow = jasmine.createSpy('i thought this function would throw an error but my setup was wrong so it didnt')
          .and.returnValue('didnt expect that to work');

        Promise.resolve()
          .then(() => {
            return shouldThrow();
          })
          .catch(error => {
            expect(error.message).toEqual('o noes!');
          })
          .finally(done)
      });
    });
  });
});

