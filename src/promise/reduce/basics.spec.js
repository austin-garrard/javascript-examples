
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
});
