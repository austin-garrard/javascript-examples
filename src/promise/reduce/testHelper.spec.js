import {TestHelper} from './testHelper';
import {testPromise} from '../../lib/testUtil';

describe('TestHelper', () => {

  let testFixture, requiredFieldIndicator, textField, submit, submitButton;

  beforeEach(() => {
    testFixture = {
      detectChanges() {},
      whenStable() { return Promise.resolve() }
    };

    requiredFieldIndicator = {
      visible: true
    };

    textField = {
      enterText(text) {
        this.formValue = text;
        requiredFieldIndicator.visible = false;
      }
    };

    submit = jasmine.createSpy();
    submitButton = {
      click() {
        this.clicked = true;
        submit(textField.formValue);
      }
    };
  });

  it('without test helper', testPromise(() => {
    return Promise.resolve()
      .then(() => {
        textField.enterText('Austin');
        testFixture.detectChanges();
        return testFixture.whenStable();
      })
      .then(() => {
        expect(requiredFieldIndicator.visible).toEqual(false);
        expect(textField.formValue).toEqual('Austin');
      })
      .then(() => {
        submitButton.click();
        testFixture.detectChanges();
        return testFixture.whenStable();
      })
      .then(() => {
        expect(submitButton.clicked).toEqual(true);
        expect(submit).toHaveBeenCalledWith('Austin');
      })
  }));


  it('allows you to execute change detection boilerplate around your steps', testPromise(() => {
    return new TestHelper(testFixture)
      .step('User enters their name', () => {
        textField.enterText('Austin');
      })
      .step('The required field indicator is hidden and the form is updated', () => {
        expect(requiredFieldIndicator.visible).toEqual(false);
        expect(textField.formValue).toEqual('Austin');
      })
      .step('User clicks the button', () => {
        submitButton.click();
      })
      .step('The form is submitted', () => {
        expect(submitButton.clicked).toEqual(true);
        expect(submit).toHaveBeenCalledWith('Austin');
      })
      .execute()
  }));
});