import {ColorService} from './colorService';
import {anError, aGoodResponse, http, aBadResponse} from './fakeHttp'
import {testPromise} from '../../lib/testUtil';

describe('ColorService', () => {
  let colorService;

  beforeEach(() => {
    colorService = new ColorService();
  });

  describe('getColors', () => {
    it('gets colors', testPromise(() => {
      spyOn(http, 'get').and.returnValue(aGoodResponse({
        colors: ['red', 'green', 'blue', 'purple']
      }));

      return colorService.getColors()
        .then(response => response.json())
        .then(responseBody => {
          expect(responseBody).toEqual({colors: ['red', 'green', 'blue', 'purple']});
        })
    }));

    it('allows you to inspect the response', testPromise(() => {
      spyOn(http, 'get').and.returnValue(aBadResponse({
        error: 'missing parameters or something'
      }));

      return colorService.getColors()
        .then(response => {
          expect(response.ok).toEqual(false);
          return response.json();
        })
        .then(responseBody => {
          expect(responseBody).toEqual({
            error: 'missing parameters or something'
          });
        })
    }));

    it('allows you to catch fatal errors which caused the request to not complete', testPromise(() => {
      spyOn(http, 'get').and.returnValue(anError('connection error'));

      return colorService.getColors()
        .catch(error => {
          expect(error.message).toEqual('connection error');
        });
    }));
  });

  describe('makeColorCooler', () => {
    it('makes the color cooler', testPromise(() => {
      spyOn(http, 'post').and.returnValues(aGoodResponse({message: 'red was made cooler'}));

      return colorService.makeColorCooler('red')
        .then(response => response.json())
        .then(responseBody => {
          expect(responseBody).toEqual({message: 'red was made cooler'})
        })
    }));

    it('allows you to inspect the response', testPromise(() => {
      spyOn(http, 'post').and.returnValue(aBadResponse({
        error: 'missing parameters or something'
      }));

      return colorService.makeColorCooler('red')
        .then(response => {
          expect(response.ok).toEqual(false);
          return response.json();
        })
        .then(responseBody => {
          expect(responseBody).toEqual({
            error: 'missing parameters or something'
          });
        })
    }));

    it('allows you to catch fatal errors which caused the request to not complete', testPromise(() => {
      spyOn(http, 'get').and.returnValue(anError('connection error'));

      return colorService.getColors()
        .catch(error => {
          expect(error.message).toEqual('connection error');
        });
    }));
  });

  describe('createColor', () => {
    describe('color already exists', () => {
      it('throws an error that must be caught', testPromise(() => {
        spyOn(http, 'get').and.returnValue(aGoodResponse({
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
        spyOn(http, 'get').and.returnValue(aGoodResponse({
          colors: ['red', 'green', 'blue', 'purple']
        }));
        spyOn(http, 'post').and.returnValue(aGoodResponse({
          success: true
        }));

        return colorService.createColor('orange')
          .then(response => response.json())
          .then(responseBody => {
            expect(responseBody).toEqual({success: true});
          })
      }));
    });

    describe('error handling', () => {
      it('fatal errors from the first http call must be caught', testPromise(() => {
        spyOn(http, 'get').and.returnValue(anError('connection error'));

        return colorService.createColor('orange')
          .catch(error => {
            expect(error.message).toEqual('connection error');
          })
      }));

      it('fatal errors from the second http call must be caught', testPromise(() => {
        spyOn(http, 'get').and.returnValue(aGoodResponse({
          colors: ['red', 'green', 'blue', 'purple']
        }));
        spyOn(http, 'post').and.returnValue(anError('connection error'));

        return colorService.createColor('orange')
          .catch(error => {
            expect(error.message).toEqual('connection error');
          })
      }));
    });
  });

  describe('makeAllColorsCooler', () => {
    describe('happy path', () => {
      beforeEach(() => {
        spyOn(http, 'get').and.returnValue(aGoodResponse({colors: ['red', 'green', 'blue', 'purple']}));
        spyOn(http, 'post').and.returnValues(
          aGoodResponse({message: 'red was made cooler'}),
          aGoodResponse({message: 'green was made cooler'}),
          aGoodResponse({message: 'blue was made cooler'}),
          aGoodResponse({error: {message: 'purple can\'t get more cool'}})
        );
      });

      it('gets the colors', testPromise(() => {
        return colorService.makeAllColorsCooler()
          .then(() => {
            expect(http.get).toHaveBeenCalledWith('/colors');
          })
      }));

      it('makes each color cooler', testPromise(() => {
        return colorService.makeAllColorsCooler()
          .then(() => {
            expect(http.post).toHaveBeenCalledWith('/colors/red', {change: 'make it more cool'});
            expect(http.post).toHaveBeenCalledWith('/colors/green', {change: 'make it more cool'});
            expect(http.post).toHaveBeenCalledWith('/colors/blue', {change: 'make it more cool'});
            expect(http.post).toHaveBeenCalledWith('/colors/purple', {change: 'make it more cool'});
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
        spyOn(http, 'get').and.returnValue(anError('connection error'));

        return colorService.makeAllColorsCooler()
          .catch(error => {
            expect(error.message).toEqual('connection error');
          })
      }));

      it('fatal errors from the subsequent http calls must be caught', testPromise(() => {
        spyOn(http, 'get').and.returnValue(aGoodResponse({colors: ['red', 'green', 'blue', 'purple']}));
        spyOn(http, 'post').and.returnValues(
          aGoodResponse({message: 'red was made cooler'}),
          aGoodResponse({message: 'green was made cooler'}),
          anError('connection error'),
          aGoodResponse({error: {message: 'purple can\'t get more cool'}})
        );

        return colorService.makeAllColorsCooler()
          .catch(error => {
            expect(error.message).toEqual('connection error');
          })
      }));
    });
  });
});
