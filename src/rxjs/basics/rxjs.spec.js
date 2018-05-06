import {Observable} from 'rxjs/Rx';
import {BehaviorSubject, ConnectableObservable, ReplaySubject, Subject} from 'rxjs';

describe('rxjs', () => {
  describe('Observer', () => {
    it('is used to subscribe to an observable stream', done => {
      const observer = {
        next: value => expect(value).toEqual('hello world'),
        error: error => fail(error),
        complete: () => done()
      };

      Observable.of('hello world').subscribe(observer);
    });

    describe('next callback', () => {
      it('processes each value emitted from the stream', done => {
        const results = [];
        const observer = {
          next: value => results.push(value),
          error: error => fail(error),
          complete: () => {
            expect(results).toEqual(['hello', 'world']);
            done();
          }
        };

        Observable.of('hello', 'world').subscribe(observer);
      });
    });

    describe('error callback', () => {
      it('processes an error in the stream', done => {
        const observer = {
          next: value => expect(false).toEqual(true),
          error: error => {
            expect(error).toEqual('hello world');
            done();
          },
          complete: () => expect(false).toEqual(true)
        };

        Observable.throw('hello world').subscribe(observer);
      });
    });

    describe('complete callback', () => {
      it('processes the completion of the stream', done => {
        const observer = {
          next: value => expect(false).toEqual(true),
          error: error => fail(error),
          complete: () => {
            expect(true).toEqual(true);
            done();
          }
        };

        Observable.empty().subscribe(observer);
      });
    });
  });

  describe('Observable', () => {
    describe('operators', () => {
      describe('creation', () => {
        describe('create', () => {
          it('creates a stream that emits values based on a function', done => {
            const result = [];
            const observer = {
              next: value => result.push(value),
              error: error => fail(error),
              complete: () => {
                expect(result).toEqual(['hello', 'world']);
                done();
              }
            };

            Observable.create(observer => {
              observer.next('hello');
              observer.next('world');
              observer.complete();
            })
              .subscribe(observer);
          });
        });

        describe('of', () => {
          it('creates a stream that emits a value and completes', done => {
            const observer = {
              next: value => expect(value).toEqual('hello world'),
              error: error => fail(error),
              complete: () => done()
            };

            Observable.of('hello world').subscribe(observer);
          });

          it('creates a stream that emits multiple values in order and completes', done => {
            let result = '';
            const observer = {
              next: value => result += value,
              error: error => fail(error),
              complete: () => {
                expect(result).toEqual('hello world');
                done();
              }
            };

            Observable.of('hello ', 'world').subscribe(observer);
          });
        });

        describe('throw', () => {
          it('creates a stream that immediately throws an error', done => {
            const observer = {
              next: value => expect(false).toEqual(true),
              error: error => {
                expect(error).toEqual('hello world');
                done();
              },
              complete: () => expect(false).toEqual(true)
            };

            Observable.throw('hello world').subscribe(observer);
          });
        });

        describe('empty', () => {
          it('creates a stream that immediately completes', done => {
            const observer = {
              next: value => expect(false).toEqual(true),
              error: error => fail(error),
              complete: () => {
                expect(true).toEqual(true);
                done();
              }
            };

            Observable.empty().subscribe(observer);
          });
        });
      });

      describe('transformation', () => {
        describe('map', () => {
          it('transforms a value after it has been emitted', done => {
            const result = [];
            const observer = {
              next: value => result.push(value),
              error: error => fail(error),
              complete: () => {
                expect(result).toEqual(['hello!', 'world!']);
                done();
              }
            };

            Observable.of('hello', 'world')
              .map(value => value + '!')
              .subscribe(observer);
          });

          it('returns an observable', done => {
            const result = [];
            const observer = {
              next: value => result.push(value),
              error: error => fail(error),
              complete: () => {
                expect(result).toEqual(['HELLO!', 'WORLD!']);
                done();
              }
            };

            Observable.of('hello', 'world')
              .map(value => value + '!')
              .map(value => value.toUpperCase())
              .subscribe(observer);
          });

        });

        it('', () => {
          // beforeEach(...)
          const source$ = new Subject();
          spyOn(service, 'getTaco').and.returnValue(source$);

          // it('does a thing', ...))
          source$.next(aTaco().withExtraCheese().build());
        });

        describe('concatMap', () => {
          it('transforms a value with an inner observable', done => {
            const observer = {
              next: value => expect(value).toEqual('hello world'),
              error: error => fail(error),
              complete: () => done()
            };

            const httpQuery1 = () => Observable.of('hello');
            const httpQuery2 = param => Observable.of(param + ' world');
            httpQuery1()
              .mergeMap(value => httpQuery2(value))
              .subscribe(observer);
          });

          it('transforms a value with an inner promise', done => {
            const observer = {
              next: value => expect(value).toEqual('hello world'),
              error: error => fail(error),
              complete: () => done()
            };

            const httpQuery1 = () => Observable.of('hello');
            const httpQuery2 = param => Promise.resolve(param + ' world');
            httpQuery1()
              .mergeMap(value => httpQuery2(value))
              .subscribe(observer);
          });

          it('returns an observable', done => {
            const observer = {
              next: value => expect(value).toEqual('hello world!'),
              error: error => fail(error),
              complete: () => done()
            };

            const httpQuery1 = () => Observable.of('hello');
            const httpQuery2 = param => Observable.of(param + ' world');
            httpQuery1()
              .mergeMap(value => httpQuery2(value))
              .map(value => value + '!')
              .subscribe(observer);
          });

          it('waits for inner observables to complete before mapping the next value', done => {
            const results = [];
            const observer = {
              next: value => results.push(value),
              error: error => fail(error),
              complete: () => {
                expect(results).toEqual(['hello', 'world']);
                done();
              }
            };

            Observable.of(['hello', 100], ['world', 10])
              .concatMap(value => {
                const [data, durationMs] = value;
                return Observable.of(data).delay(durationMs)
              })
              .subscribe(observer);
          });

          it('transforms a value with an inner observable/promise and a projection function', done => {
            const results = [];
            const observer = {
              next: value => results.push(value),
              error: error => fail(error),
              complete: () => {
                expect(results).toEqual(['hello!', 'world!']);
                done();
              }
            };

            Observable.of('hello', 'world')
              .concatMap(
                value => Observable.of(value),
                result => result + '!')
              .subscribe(observer);
          });

          it('errors thrown by inner observables are handled by the error callback', done => {
            const observer = {
              next: value => expect(false).toEqual(true),
              error: error => {
                expect(error).toEqual('hello');
                done();
              },
              complete: () => done()
            };

            const httpQuery1 = () => Observable.of('hello');
            const httpQuery2 = param => Observable.throw(param);
            httpQuery1()
              .mergeMap(value => httpQuery2(value))
              .subscribe(observer);
          });
        });
      });

      fdescribe('multicast', () => {
        let source, count;

        const emptyObserver = {
          next: value => null,
          error: error => fail(error),
          complete: () => null
        };

        const observe = (source, returnSub = false) => {
          let results = [];
          const sub = source.subscribe(
            value => results.push(value),
            error => fail(error));

          if (returnSub) {
            return [results, sub];
          }
          return results;
        };

        beforeEach(() => {
          count = 0;
          source = Observable.create(observer => {
            count += 1;
            observer.next(count);
            observer.complete();
          });
        });

        describe('variant: connectable observable', () => {
          describe('using a Subject', () => {
            describe('with the connect method', () => {
              it('emits source events to all subscribers', () => {
                source = new Subject();
                const multicasted = source.multicast(new Subject());

                multicasted.connect();

                const result1 = observe(multicasted);
                const result2 = observe(multicasted);

                source.next('hello');
                source.next('goodbye');
                source.complete();

                expect(result1).toEqual(['hello', 'goodbye']);
                expect(result2).toEqual(['hello', 'goodbye']);
              });

              it('only subscribes to the source observable once', () => {
                const multicasted = source.multicast(new Subject());

                multicasted.connect();

                multicasted.subscribe(emptyObserver);
                multicasted.subscribe(emptyObserver);
                multicasted.subscribe(emptyObserver);

                expect(count).toEqual(1);
              });

              it('only emits source events occurring after the connect call', () => {
                source = new Subject();
                const multicasted = source.multicast(new Subject());

                const result1 = observe(multicasted);
                const result2 = observe(multicasted);

                source.next('hello');
                multicasted.connect();
                source.next('goodbye');
                source.complete();

                expect(result1).toEqual(['goodbye']);
                expect(result2).toEqual(['goodbye']);
              });

              it('only emits source events occurring after subscribing', () => {
                source = new Subject();
                const multicasted = source.multicast(new Subject());
                multicasted.connect();

                const result1 = observe(multicasted);
                source.next('hello');
                const result2 = observe(multicasted);

                source.next('goodbye');
                source.complete();

                expect(result1).toEqual(['hello', 'goodbye']);
                expect(result2).toEqual(['goodbye']);
              });

              it('completes when the source completes', done => {
                source = new Subject();
                const multicasted = source.multicast(new Subject());
                multicasted.connect();

                multicasted.subscribe(
                  value => expect(value).toEqual('hello'),
                  error => fail(error),
                  () => done()
                );

                source.next('hello');
                source.complete();
              });

              it('is the publish operator', () => {
                source = new Subject();
                const multicasted = source.publish();

                multicasted.connect();

                const result1 = observe(multicasted);
                const result2 = observe(multicasted);

                source.next('hello');
                source.next('goodbye');
                source.complete();

                expect(result1).toEqual(['hello', 'goodbye']);
                expect(result2).toEqual(['hello', 'goodbye']);
              });
            });

            describe('with the refCount operator', () => {
              it('emits source events to all subscribers', () => {
                source = new Subject();
                const multicasted = source.publish().refCount();

                const result1 = observe(multicasted);
                const result2 = observe(multicasted);

                source.next('hello');
                source.next('goodbye');
                source.complete();

                expect(result1).toEqual(['hello', 'goodbye']);
                expect(result2).toEqual(['hello', 'goodbye']);
              });

              it('only subscribes to the source observable once', () => {
                const multicasted = source.publish().refCount();

                multicasted.subscribe(emptyObserver);
                multicasted.subscribe(emptyObserver);
                multicasted.subscribe(emptyObserver);

                expect(count).toEqual(1);
              });

              it('only emits source events occurring after subscribing', () => {
                source = new Subject();
                const multicasted = source.publish().refCount();

                const result1 = observe(multicasted);
                source.next('hello');
                const result2 = observe(multicasted);

                source.next('goodbye');
                source.complete();

                expect(result1).toEqual(['hello', 'goodbye']);
                expect(result2).toEqual(['goodbye']);
              });

              it('completes when the source completes', done => {
                source = new Subject();
                const multicasted = source.publish().refCount();

                multicasted.subscribe(
                  value => expect(value).toEqual('hello'),
                  error => fail(error),
                  () => done()
                );

                source.next('hello');
                source.complete();
              });
            });
          });

          describe('using a Subject factory', () => {
            describe('with the connect method', () => {
              it('emits source events to all subscribers', () => {
                source = new Subject();
                const multicasted = source.multicast(() => new Subject());

                multicasted.connect();

                const result1 = observe(multicasted);
                const result2 = observe(multicasted);

                source.next('hello');
                source.next('goodbye');
                source.complete();

                expect(result1).toEqual(['hello', 'goodbye']);
                expect(result2).toEqual(['hello', 'goodbye']);
              });

              it('only subscribes to the source observable once', () => {
                const multicasted = source.multicast(() => new Subject());

                multicasted.connect();

                multicasted.subscribe(emptyObserver);
                multicasted.subscribe(emptyObserver);
                multicasted.subscribe(emptyObserver);

                expect(count).toEqual(1);
              });

              it('only emits source events occurring after the connect call', () => {
                source = new Subject();
                const multicasted = source.multicast(() => new Subject());

                const result1 = observe(multicasted);
                const result2 = observe(multicasted);

                source.next('hello');
                multicasted.connect();
                source.next('goodbye');
                source.complete();

                expect(result1).toEqual(['goodbye']);
                expect(result2).toEqual(['goodbye']);
              });

              it('only emits source events occurring after subscribing', () => {
                source = new Subject();
                const multicasted = source.multicast(() => new Subject());
                multicasted.connect();

                const result1 = observe(multicasted);
                source.next('hello');
                const result2 = observe(multicasted);

                source.next('goodbye');
                source.complete();

                expect(result1).toEqual(['hello', 'goodbye']);
                expect(result2).toEqual(['goodbye']);
              });

              it('completes when the source completes', done => {
                source = new Subject();
                const multicasted = source.multicast(() => new Subject());
                multicasted.connect();

                multicasted.subscribe(
                  value => expect(value).toEqual('hello'),
                  error => fail(error),
                  () => done()
                );

                source.next('hello');
                source.complete();
              });
            });

            describe('with the refCount operator', () => {
              it('emits source events to all subscribers', () => {
                source = new Subject();
                const multicasted = source.multicast(() => new Subject).refCount();

                const result1 = observe(multicasted);
                const result2 = observe(multicasted);

                source.next('hello');
                source.next('goodbye');
                source.complete();

                expect(result1).toEqual(['hello', 'goodbye']);
                expect(result2).toEqual(['hello', 'goodbye']);
              });

              it('only subscribes to the source observable once as long as there are other subscribers', () => {
                source = Observable.create(observer => {
                  count += 1;
                  observer.next(count);
                });

                const multicasted = source.multicast(() => new Subject).refCount();

                multicasted.subscribe(emptyObserver);
                multicasted.subscribe(emptyObserver);
                multicasted.subscribe(emptyObserver);

                expect(count).toEqual(1);
              });

              it('resubscribes to the source observable', () => {
                source = Observable.create(observer => {
                  count += 1;
                  observer.next(count);
                });

                const multicasted = source.multicast(() => new Subject).refCount();

                const subs = [
                  multicasted.subscribe(emptyObserver),
                  multicasted.subscribe(emptyObserver),
                  multicasted.subscribe(emptyObserver)
                ];

                expect(count).toEqual(1);

                subs.forEach(sub => sub.unsubscribe());

                multicasted.subscribe(emptyObserver)

                expect(count).toEqual(2);
              });

              it('only emits source events occurring after subscribing', () => {
                source = new Subject();
                const multicasted = source.multicast(() => new Subject).refCount();

                const result1 = observe(multicasted);
                source.next('hello');
                const result2 = observe(multicasted);

                source.next('goodbye');
                source.complete();

                expect(result1).toEqual(['hello', 'goodbye']);
                expect(result2).toEqual(['goodbye']);
              });

              it('completes when the source completes', done => {
                source = new Subject();
                const multicasted = source.multicast(() => new Subject).refCount();

                multicasted.subscribe(
                  value => expect(value).toEqual('hello'),
                  error => fail(error),
                  () => done()
                );

                source.next('hello');
                source.complete();
              });

              it('is the share operator', () => {
                source = Observable.create(observer => {
                  count += 1;
                  observer.next(count);
                });

                const multicasted = source.share();

                const subs = [
                  multicasted.subscribe(emptyObserver),
                  multicasted.subscribe(emptyObserver),
                  multicasted.subscribe(emptyObserver)
                ];

                expect(count).toEqual(1);

                subs.forEach(sub => sub.unsubscribe());

                multicasted.subscribe(emptyObserver);

                expect(count).toEqual(2);
              });
            });
          });

        });


        describe('variant: selector function', () => {

        });
      });
    });
  });
});

