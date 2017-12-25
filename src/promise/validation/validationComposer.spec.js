import {ValidationComposer} from './validationComposer';
import {allLowerCase, alwaysFails, alwaysFails2, alwaysPasses, notNull} from './validations';

describe('ValidationComposer', () => {
  describe('primary validations', () => {
    it('proceeds when all primary validations pass', () => {
      try {
        new ValidationComposer([notNull, alwaysPasses]).validate('hello');
        expect(true).toEqual(true);
      } catch (errors) {
        expect(false).toEqual(true);
      }
    });

    it('throws when any primary validations fail', () => {
      try {
        new ValidationComposer([notNull, alwaysPasses]).validate(null);
        expect(false).toEqual(true);
      } catch (errors) {
        expect(errors).toEqual(['Value cannot be null']);
      }
    });

    it('reports all primary validations that fail', () => {
      try {
        new ValidationComposer([notNull, alwaysPasses, alwaysFails]).validate(null);
        expect(false).toEqual(true);
      } catch (errors) {
        expect(errors).toEqual(['Value cannot be null', 'o noes']);
      }
    });
  });

  describe('secondary validations', () => {
    it('is run when all primary validations pass', () => {
      try {
        new ValidationComposer([notNull, alwaysPasses], [alwaysFails]).validate('value');
        expect(true).toEqual(false);
      } catch (errors) {
        expect(errors).toEqual(['o noes']);
      }
    });

    it('is not run when a primary validation fails', () => {
      spyOn(alwaysPasses, 'pass');
      spyOn(alwaysFails2, 'pass');

      try {
        new ValidationComposer([notNull, alwaysFails], [alwaysPasses, alwaysFails2]).validate('value');
        expect(true).toEqual(false);
      } catch (errors) {
        expect(alwaysPasses.pass).not.toHaveBeenCalled();
        expect(alwaysFails2.pass).not.toHaveBeenCalled();
      }
    });

    it('proceeds when all primary and secondary validations pass', () => {
      try {
        new ValidationComposer([notNull, alwaysPasses], [allLowerCase, alwaysPasses]).validate('value');
        expect(true).toEqual(true);
      } catch (errors) {
        expect(true).toEqual(false);
      }
    });

    it('throws when any secondary validations fail', () => {
      try {
        new ValidationComposer([notNull, alwaysPasses], [allLowerCase, alwaysPasses]).validate('VaLuE');
        expect(true).toEqual(false);
      } catch (errors) {
        expect(errors).toEqual(['All characters must be lowercase']);
      }
    });

    it('reports all secondary validations that fail', () => {
      try {
        new ValidationComposer([notNull, alwaysPasses], [allLowerCase, alwaysFails2]).validate('VaLuE');
        expect(true).toEqual(false);
      } catch (errors) {
        expect(errors).toEqual(['All characters must be lowercase', 'o no not again']);
      }
    });
  });
});
