import {ColorService} from './colorService';
import {anError, aGoodResponse, aBadResponse} from './fakeResponse'
import {testPromise} from '../../lib/testUtil';

describe('ColorService', () => {
  let colorService;

  beforeEach(() => {
    colorService = new ColorService();
    global.fetch = () => {
      throw new Error('mock out global.fetch for these tests');
    };
  });

  describe('getColors', () => {
    it('gets colors', testPromise(() => {
      global.fetch = jasmine.createSpy().and.returnValue(aGoodResponse({
        colors: ['red', 'green', 'blue', 'purple']
      }));

      return colorService.getColors()
        .then(response => response.json())
        .then(responseBody => {
          expect(responseBody).toEqual({colors: ['red', 'green', 'blue', 'purple']});
        })
    }));

    it('allows you to inspect the response', testPromise(() => {
      global.fetch = jasmine.createSpy().and.returnValue(aBadResponse({
        error: 'missing parameters or something'
      }));

      return colorService.getColors()
        .then(response => {
          expect(response.ok).toEqual(false);
          expect(response.status).toEqual(400);
          return response.json();
        })
        .then(responseBody => {
          expect(responseBody).toEqual({
            error: 'missing parameters or something'
          });
        })
    }));

    it('allows you to catch fatal errors which caused the request to not complete', testPromise(() => {
      global.fetch = jasmine.createSpy().and.returnValue(anError('connection error'));

      return colorService.getColors()
        .then(() => {
          expect(false).toEqual(true);
        })
        .catch(error => {
          expect(error.message).toEqual('connection error');
        });
    }));
  });

  describe('makeColorCooler', () => {
    it('makes the color cooler', testPromise(() => {
      global.fetch = jasmine.createSpy().and.returnValues(aGoodResponse({message: 'red was made cooler'}));

      return colorService.makeColorCooler('red')
        .then(response => response.json())
        .then(responseBody => {
          expect(responseBody).toEqual({message: 'red was made cooler'})
        })
    }));

    it('allows you to inspect the response', testPromise(() => {
      global.fetch = jasmine.createSpy().and.returnValue(aBadResponse({
        error: 'missing parameters or something'
      }));

      return colorService.makeColorCooler('red')
        .then(response => {
          expect(response.ok).toEqual(false);
          expect(response.status).toEqual(400);
          return response.json();
        })
        .then(responseBody => {
          expect(responseBody).toEqual({
            error: 'missing parameters or something'
          });
        })
    }));

    it('allows you to catch fatal errors which caused the request to not complete', testPromise(() => {
      global.fetch = jasmine.createSpy().and.returnValue(anError('connection error'));

      return colorService.getColors()
        .then(() => {
          expect(false).toEqual(true);
        })
        .catch(error => {
          expect(error.message).toEqual('connection error');
        });
    }));
  });

  describe('createColor', () => {
    describe('color already exists', () => {
      it('throws an error that must be caught', testPromise(() => {
        global.fetch = jasmine.createSpy().and.returnValue(aGoodResponse({
          colors: ['red', 'green', 'blue', 'purple']
        }));

        return colorService.createColor('purple')
          .catch(error => {
            expect(error.message).toEqual('purple already exists');
          });
      }));
    });

    describe('color does not exist', () => {
      it('creates a color', testPromise(() => {
        global.fetch = jasmine.createSpy().and.returnValues(
          aGoodResponse({colors: ['red', 'green', 'blue', 'purple']}),
          aGoodResponse({success: true})
        );

        return colorService.createColor('orange')
          .then(response => response.json())
          .then(responseBody => {
            expect(responseBody).toEqual({success: true});
          })
      }));
    });

    describe('error handling', () => {
      it('fatal errors from the first http call must be caught', testPromise(() => {
        global.fetch = jasmine.createSpy().and.returnValue(anError('connection error'));

        return colorService.createColor('orange')
          .then(() => {
            expect(false).toEqual(true);
          })
          .catch(error => {
            expect(error.message).toEqual('connection error');
          })
      }));

      it('fatal errors from the second http call must be caught', testPromise(() => {
        global.fetch = jasmine.createSpy().and.returnValues(
          aGoodResponse({colors: ['red', 'green', 'blue', 'purple']}),
          anError('connection error')
        );

        return colorService.createColor('orange')
          .then(() => {
            expect(false).toEqual(true);
          })
          .catch(error => {
            expect(error.message).toEqual('connection error');
          })
      }));
    });
  });

  describe('makeAllColorsCooler', () => {
    describe('happy path', () => {
      beforeEach(() => {
        global.fetch = jasmine.createSpy().and.returnValues(
          aGoodResponse({colors: ['red', 'green', 'blue', 'purple']}),
          aGoodResponse({message: 'red was made cooler'}),
          aGoodResponse({message: 'green was made cooler'}),
          aGoodResponse({message: 'blue was made cooler'}),
          aGoodResponse({error: {message: 'purple can\'t get more cool'}})
        );
      });

      it('gets the colors', testPromise(() => {
        return colorService.makeAllColorsCooler()
          .then(() => {
            expect(global.fetch).toHaveBeenCalledWith('/colors');
          })
      }));

      it('makes each color cooler', testPromise(() => {
        return colorService.makeAllColorsCooler()
          .then(() => {
            expect(global.fetch).toHaveBeenCalledWith('/colors/red', {body: JSON.stringify({change: 'make it more cool'})});
            expect(global.fetch).toHaveBeenCalledWith('/colors/green', {body: JSON.stringify({change: 'make it more cool'})});
            expect(global.fetch).toHaveBeenCalledWith('/colors/blue', {body: JSON.stringify({change: 'make it more cool'})});
            expect(global.fetch).toHaveBeenCalledWith('/colors/purple', {body: JSON.stringify({change: 'make it more cool'})});
          })
      }));

      it('combines the responses for making the colors cooler', testPromise(() => {
        return colorService.makeAllColorsCooler()
          .then(result => {
            expect(result).toEqual([
              {message: 'red was made cooler'},
              {message: 'green was made cooler'},
              {message: 'blue was made cooler'},
              {
                error: {
                  message: 'purple can\'t get more cool'
                }
              }
            ]);
          })
      }));
    });

    describe('error handling', () => {
      it('fatal errors from the first http call must be caught', testPromise(() => {
        global.fetch = jasmine.createSpy().and.returnValue(anError('connection error'));

        return colorService.makeAllColorsCooler()
          .then(() => {
            expect(false).toEqual(true);
          })
          .catch(error => {
            expect(error.message).toEqual('connection error');
          })
      }));

      it('fatal errors from the subsequent http calls must be caught', testPromise(() => {
        global.fetch = jasmine.createSpy().and.returnValues(
          aGoodResponse({colors: ['red', 'green', 'blue', 'purple']}),
          aGoodResponse({message: 'red was made cooler'}),
          aGoodResponse({message: 'green was made cooler'}),
          anError('connection error'),
          aGoodResponse({error: {message: 'purple can\'t get more cool'}})
        );

        return colorService.makeAllColorsCooler()
          .then(() => {
            expect(false).toEqual(true);
          })
          .catch(error => {
            expect(error.message).toEqual('connection error');
          })
      }));
    });
  });
});
