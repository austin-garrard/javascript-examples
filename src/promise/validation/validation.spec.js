import {testPromise} from '../../lib/testUtil';
import {allLowerCase, alwaysFails, alwaysFails2, alwaysPasses, notNull, ValidationComposer} from './validation';

describe('validations', () => {
  describe('primary validations', () => {
    it('proceeds when all primary validations pass', testPromise(() => {
      return new ValidationComposer([notNull, alwaysPasses]).validate('hello')
        .then(result => {
          expect(result).toEqual(true);
        })
        .catch(() => {
          console.log('skipped');
          expect(true).toEqual(false);
        })
    }));

    it('throws when any primary validations fail', testPromise(() => {
      return new ValidationComposer([notNull, alwaysPasses]).validate(null)
        .then(() => {
          console.log('skipped');
          expect(true).toEqual(false);
        })
        .catch(errors => {
          expect(errors).toEqual(['Value cannot be null']);
        })
    }));

    it('reports all primary validations that fail', testPromise(() => {
      return new ValidationComposer([notNull, alwaysPasses, alwaysFails]).validate(null)
        .then(() => {
          console.log('skipped');
          expect(true).toEqual(false);
        })
        .catch(errors => {
          expect(errors).toEqual(['Value cannot be null', 'o noes']);
        })
    }));
  });

  describe('secondary validations', () => {
    it('is run when all primary validations pass', testPromise(() => {
      return new ValidationComposer([notNull, alwaysPasses], [alwaysFails]).validate('value')
        .then(() => {
          console.log('skipped');
          expect(true).toEqual(false);
        })
        .catch(errors => {
          expect(errors).toEqual(['o noes'])
        });
    }));

    it('is not run when a primary validation fails', testPromise(() => {
      spyOn(alwaysPasses, 'pass');
      spyOn(alwaysFails2, 'pass');

      return new ValidationComposer([notNull, alwaysFails], [alwaysPasses, alwaysFails2]).validate('value')
        .then(() => {
          console.log('skipped');
          expect(true).toEqual(false);
        })
        .catch(errors => {
          expect(errors).toEqual(['o noes']);
          expect(alwaysPasses.pass).not.toHaveBeenCalled();
          expect(alwaysFails2.pass).not.toHaveBeenCalled();
        });
    }));

    it('proceeds when all primary and secondary validations pass', testPromise(() => {
      return new ValidationComposer([notNull, alwaysPasses], [allLowerCase, alwaysPasses]).validate('value')
        .then(result => {
          expect(result).toEqual(true);
        })
        .catch(errors => {
          console.log('skipped');
          expect(true).toEqual(false);
        });
    }));

    it('throws when any secondary validations fail', testPromise(() => {
      return new ValidationComposer([notNull, alwaysPasses], [allLowerCase, alwaysPasses]).validate('VaLuE')
        .then(result => {
          console.log('skipped');
          expect(true).toEqual(false);
        })
        .catch(errors => {
          expect(errors).toEqual(['All characters must be lowercase']);
        });
    }));

    it('reports all secondary validations that fail', testPromise(() => {
      return new ValidationComposer([notNull, alwaysPasses], [allLowerCase, alwaysFails2]).validate('VaLuE')
        .then(result => {
          console.log('skipped');
          expect(true).toEqual(false);
        })
        .catch(errors => {
          expect(errors).toEqual(['All characters must be lowercase', 'o no not again']);
        });
    }));
  });
});
