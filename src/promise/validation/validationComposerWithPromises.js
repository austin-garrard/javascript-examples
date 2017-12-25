
export class ValidationComposerWithPromises {
  constructor(...validationGroups) {
    this.validationGroups = validationGroups;
  }

  validate(value) {
    const collectErrors = (errors, validation) => {
      return validation.pass(value) ? errors : errors.concat([validation.error]);
    };

    const runEachValidation = validationGroup => {
      const errors = validationGroup.reduce(collectErrors, []);
      return errors.length > 0 ? Promise.reject(errors) : true;
    };

    const chainValidationGroups = (promise, validationGroup) => {
      return promise.then(() => runEachValidation(validationGroup));
    };

    return this.validationGroups.reduce(chainValidationGroups, Promise.resolve());
  }
}
