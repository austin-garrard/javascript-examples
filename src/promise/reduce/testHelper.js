
export class TestHelper {
  constructor(testFixture) {
    this.testFixture = testFixture;
    this.steps = [];
  }

  step(description, step) {
    this.steps.push(step);
    return this;
  }

  execute() {
    const executeStepsWithChangeDetection = (promise, step) => {
      return promise.then(() => {
        step();
        this.testFixture.detectChanges();
        return this.testFixture.whenStable();
      });
    };

    return this.steps.reduce(executeStepsWithChangeDetection, Promise.resolve())
  }
}
