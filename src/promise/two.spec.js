import {ColorService} from '../lib/colorService';
import {http} from '../lib/fakeHttp'

describe('ColorService', () => {
  let colorService;

  beforeEach(() => {
    colorService = new ColorService();
  });

  describe('getColors', () => {
    it('gets colors', (done) => {
      colorService.getColors()
        .then(responseBody => {
          expect(responseBody).toEqual({ colors: ['red', 'green', 'blue', 'purple'] });
        })
        .finally(done);
    });

    it('handles network errors', (done) => {
      http.resolve = false;

      colorService.getColors()
        .then(responseBody => {
          expect(responseBody).toEqual({ error: 'connection error'});
        })
        .catch(error => fail(error))
        .finally(() => {
          http.resolve = true;
          done();
        });
    });
  });


  describe('change color', () => {
    it('allows you to handle application errors', (done) => {
      colorService.changeColor('purple')
        .then(response => {
          expect(response.ok).toEqual(false);
          return response.json();
        })
        .then(responseBody => {
          expect(responseBody).toEqual({
            error: { message: 'it can\'t get more cool'}
          })
        })
        .finally(done)
    })
  })
});
