
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

  describe('errors returned from then handlers get pass to the immediately next handler', () => {
    it('then handler', (done) => {
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

    it('catch handler', (done) => {
      Promise.resolve('value')
        .then(value => new Error('whoops'))
        .catch(error => {
          expect(error.message).toEqual('whoops');
        })
        .finally(done)
    });
  });

  describe('reducing to a promise', () => {
    it('executes the steps in order', (done) => {
      const spy = jasmine.createSpy();
      const steps = [
        () => spy('1'),
        () => spy('2'),
        () => spy('3'),
      ];

      steps.reduce((promise, step) => promise.then(step), Promise.resolve())
        .then(() => {
          expect(spy.calls.argsFor(0)).toEqual(['1']);
          expect(spy.calls.argsFor(1)).toEqual(['2']);
          expect(spy.calls.argsFor(2)).toEqual(['3']);
        })
        .finally(done);
    });

    it('carries the resolved values through', (done) => {
      const steps = [
        (value) => value + ' there',
        (value) => value + ' my',
        (value) => value + ' friend!',
      ];

      steps.reduce((promise, step) => promise.then(step), Promise.resolve('hello'))
        .then(result => {
          expect(result).toEqual('hello there my friend!');
        })
        .finally(done);
    });

    it('allows you to catch errors', (done) => {
      const steps = [
        () => 'this is fine',
        () => null.anyoneHome(),
        () => 'this is also fine'
      ];

      steps.reduce((promise, step) => promise.then(step), Promise.resolve())
        .catch(error => {
          expect(error.name).toEqual('TypeError');
          expect(error.message).toEqual('Cannot read property \'anyoneHome\' of null');
        })
        .finally(done);
    });

    it('allows you to execute boilerplate around your steps', (done) => {
      const testFixture = {
        detectChanges() {},
        whenStable() { return Promise.resolve() }
      };
      const button = {
        click() { this.clicked = true }
      };
      const textField = {
        enterText(text) { this.text = text; }
      };

      const steps = [
        () => textField.enterText('hello'),
        () => expect(textField.text).toEqual('hello'),
        () => button.click(),
        () => expect(button.clicked).toEqual(true)
      ];

      const executeStepsWithChangeDetection = (promise, step) => {
        return promise.then(() => {
          step();
          testFixture.detectChanges();
          return testFixture.whenStable();
        })
      };

      steps.reduce(executeStepsWithChangeDetection, Promise.resolve())
        .finally(done);
    });
  });
});

