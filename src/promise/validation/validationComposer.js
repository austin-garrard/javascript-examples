
export class ValidationComposer {
  constructor(...validationGroups) {
    this.validationGroups = validationGroups;
  }

  validate(value) {
    const collectErrors = (errors, validation) => {
      return validation.pass(value) ? errors : errors.concat([validation.error]);
    };

    const runEachValidation = validations => validations.reduce(collectErrors, []);

    this.validationGroups.forEach(validationGroup => {
      const errors = runEachValidation(validationGroup);
      if (errors.length > 0) {
        throw errors;
      }
    });
  }
}
