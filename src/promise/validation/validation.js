
export const notNull = {
  pass: value => value !== null,
  error: 'Value cannot be null'
};

export const allLowerCase = {
  pass: value => value === value.toLowerCase(),
  error: 'All characters must be lowercase'
};

export const alwaysFails = {
  pass: value => false,
  error: 'o noes'
};

export const alwaysFails2 = {
  pass: value => false,
  error: 'o no not again'
};

export const alwaysPasses = {
  pass: value => true,
  error: 'nice try'
};

export class ValidationComposer {
  constructor(...validationGroups) {
    this.validationGroups = validationGroups;
  }

  validate(value) {
    const runEachValidation = validations => {
      const errors = validations.reduce((errors, validation) => {
        return validation.pass(value) ? errors : errors.concat([validation.error]);
      }, []);

      return errors.length > 0 ? Promise.reject(errors) : true;
    };

    return this.validationGroups.reduce((promise, validations) => {
      return promise.then(() => runEachValidation(validations));
    }, Promise.resolve());
  }
}
