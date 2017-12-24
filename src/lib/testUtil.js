
export function testPromise(test) {
  return (done) => {
    test()
      .catch(error => fail(error))
      .finally(done)
  };
}
