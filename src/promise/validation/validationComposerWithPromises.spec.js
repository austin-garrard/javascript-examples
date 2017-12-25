import {testPromise} from '../../lib/testUtil';
import {allLowerCase, alwaysFails, alwaysFails2, alwaysPasses, notNull} from './validations';
import {ValidationComposerWithPromises} from './validationComposerWithPromises';

describe('ValidationComposerWithPromises', () => {
  describe('primary validations', () => {
    it('proceeds when all primary validations pass', testPromise(() => {
      return new ValidationComposerWithPromises([notNull, alwaysPasses]).validate('hello')
        .then(result => {
          expect(result).toEqual(true);
        })
        .catch(() => {
          expect(true).toEqual(false);
        })
    }));

    it('throws when any primary validations fail', testPromise(() => {
      return new ValidationComposerWithPromises([notNull, alwaysPasses]).validate(null)
        .then(() => {
          expect(true).toEqual(false);
        })
        .catch(errors => {
          expect(errors).toEqual(['Value cannot be null']);
        })
    }));

    it('reports all primary validations that fail', testPromise(() => {
      return new ValidationComposerWithPromises([notNull, alwaysPasses, alwaysFails]).validate(null)
        .then(() => {
          expect(true).toEqual(false);
        })
        .catch(errors => {
          expect(errors).toEqual(['Value cannot be null', 'o noes']);
        })
    }));
  });

  describe('secondary validations', () => {
    it('is run when all primary validations pass', testPromise(() => {
      return new ValidationComposerWithPromises([notNull, alwaysPasses], [alwaysFails]).validate('value')
        .then(() => {
          expect(true).toEqual(false);
        })
        .catch(errors => {
          expect(errors).toEqual(['o noes'])
        });
    }));

    it('is not run when a primary validation fails', testPromise(() => {
      spyOn(alwaysPasses, 'pass');
      spyOn(alwaysFails2, 'pass');

      return new ValidationComposerWithPromises([notNull, alwaysFails], [alwaysPasses, alwaysFails2]).validate('value')
        .then(() => {
          expect(true).toEqual(false);
        })
        .catch(errors => {
          expect(errors).toEqual(['o noes']);
          expect(alwaysPasses.pass).not.toHaveBeenCalled();
          expect(alwaysFails2.pass).not.toHaveBeenCalled();
        });
    }));

    it('proceeds when all primary and secondary validations pass', testPromise(() => {
      return new ValidationComposerWithPromises([notNull, alwaysPasses], [allLowerCase, alwaysPasses]).validate('value')
        .then(result => {
          expect(result).toEqual(true);
        })
        .catch(errors => {
          expect(true).toEqual(false);
        });
    }));

    it('throws when any secondary validations fail', testPromise(() => {
      return new ValidationComposerWithPromises([notNull, alwaysPasses], [allLowerCase, alwaysPasses]).validate('VaLuE')
        .then(result => {
          expect(true).toEqual(false);
        })
        .catch(errors => {
          expect(errors).toEqual(['All characters must be lowercase']);
        });
    }));

    it('reports all secondary validations that fail', testPromise(() => {
      return new ValidationComposerWithPromises([notNull, alwaysPasses], [allLowerCase, alwaysFails2]).validate('VaLuE')
        .then(result => {
          expect(true).toEqual(false);
        })
        .catch(errors => {
          expect(errors).toEqual(['All characters must be lowercase', 'o no not again']);
        });
    }));
  });
});
