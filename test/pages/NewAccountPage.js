// tests/pages/NewAccountPage.js
const selectors = require("../selectors/newAccountSelector");
const DOMHandler = require('../lib/DOMHandler');
const messages = require('../lib/testConfig');

const { By, until, Key } = require('selenium-webdriver');

class NewAccountPage {
  constructor(driver, baseUrl, timeout) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.selectors = selectors;
    this.errorMapping = {
      [this.selectors.nameInput]: this.selectors.nameError,
      [this.selectors.surnameInput]: this.selectors.surnameError,
      [this.selectors.emailInput]: this.selectors.emailError,
      [this.selectors.usernameInput]: this.selectors.usernameError,
      [this.selectors.passwordInput]: this.selectors.passwordError,
      [this.selectors.termsCheckbox]: this.selectors.termsError,
      [this.selectors.confirmPasswordInput]: this.selectors.confirmPasswordError
    };
    this.domHandler = new DOMHandler(driver, timeout);
  }

  async open() {
    await this.driver.get(this.baseUrl);
  }

  async isValidPassword(password, errorMessage) {
    await this.open();

    const passwordField = await this.driver.findElement(By.css(this.selectors.passwordInput));

    await this.driver.wait(until.elementIsVisible(passwordField), this.timeout);
    await passwordField.sendKeys(password);
    await this.driver.actions().sendKeys(Key.TAB).perform();

    const result = await this.domHandler.isShowingValidationMessageWhenBlur(
      this.selectors.passwordInput,
      errorMessage
    );

    return result;
  }

  async submitWithoutTerms() {
    await this.domHandler.clickWhenReady(this.selectors.termsCheckbox);
  }
  async hasTermsError() {
    return await this.domHandler.isShowingValidationMessageWhenBlur(this.selectors.termsCheckbox, messages.terms, true);
  }

  async nameHasErrorVisibleWhenEmpty(errorMessage) {
    return await this.requiredErrorVisible('nameInput', errorMessage);
  }

 async surnameHasErrorVisibleWhenEmpty(errorMessage) {
    return await this.requiredErrorVisible('surnameInput', errorMessage);
  }

 async emailHasErrorVisibleWhenEmpty(errorMessage) {
    return await this.requiredErrorVisible('emailInput', errorMessage);
  }

 async usernameHasErrorVisibleWhenEmpty(errorMessage) {
    return await this.requiredErrorVisible('usernameInput', errorMessage);
  }

 async passwordHasErrorVisibleWhenEmpty(errorMessage) {
    return await this.requiredErrorVisible('passwordInput', errorMessage);
  }

async requiredErrorVisible(fieldKey, expectedMessage) {
    const selector = this.selectors[fieldKey];
    return await this.domHandler.isShowingValidationMessageWhenBlur(selector, expectedMessage);
  }

async isConfirmPasswordShowingMessageWhenBlur(validationMessage) {

    const result = await this.domHandler.isShowingValidationMessageWhenBlur(
     this.selectors.confirmPasswordInput, validationMessage);

    return result;
}

async isValidEmailNotShowingMessageWhenBlur() {

    const result = await this.domHandler.isShowingValidationMessageWhenBlur(this.selectors.emailInput, '', false);

    return result;
}

async isInvalidEmailShowingMessageWhenBlur(email, errorMesage) {

   await this.domHandler.fillTextField(this.selectors.emailInput, email);

    const result = await this.domHandler.isShowingValidationMessageWhenBlur(
      newAccountPage.selectors.emailInput ,errorMesage);

    return result;
}

  async fillOutAllFieldsWithValidData(data) {
    await this.domHandler.fillTextField(this.selectors.nameInput, data.name);
    await this.domHandler.fillTextField(this.selectors.surnameInput, data.surname);
    await this.domHandler.fillTextField(this.selectors.emailInput, data.email);
    await this.domHandler.fillTextField(this.selectors.usernameInput, data.username);
    await this.domHandler.fillTextField(this.selectors.passwordInput, data.password);
    await this.domHandler.fillTextField(this.selectors.confirmPasswordInput, data.confirmPassword);
  }

  async setTermsAndConditions(beChecked) {
    const checkbox = await this.domHandler.findElement(this.selectors.termsCheckbox);
    const isChecked = await checkbox.isSelected();

    if (isChecked !== beChecked) {
      await checkbox.click();
    }
  }

  async isCreateAccountButtonEnabled() {
    const btn = await this.domHandler.findElement(this.selectors.createButton);
    return (await btn.getAttribute('disabled')) === null;
  }

  async showsPasswordRequiredError(password, expectedValidationMessage) {
    await this.domHandler.fillTextField(this.selectors.passwordInput, password);

    const el = await this.domHandler.findElement(this.selectors.passwordInput);

    await this.driver.executeScript('arguments[0].blur();', el);

    return await this.isShowingValidationMessageWhenBlur(
      this.selectors.passwordInput,
      expectedValidationMessage,
    );
  }

  async enterPasswordAndConfirmation(password, confirmation) {
    await this.domHandler.fillTextField(this.selectors.passwordInput, password);
    await this.domHandler.fillTextField(this.selectors.confirmPasswordInput, confirmation);
  }

 async enterEmail(email) {
    await this.domHandler.fillTextField(this.selectors.emailInput, email);
  }

  async leaveEmailField() {

    const element = await this.domHandler.findElement(this.selectors.emailInput);
    await this.domHandler.makeElementLoseFocus(element);
  }

  async isEmailErrorAbsent() {
    const errorSelector = this.errorMapping[this.selectors.emailInput];
    const isAbsent = await this.domHandler.isElementAbsent(errorSelector);

    return isAbsent;
  }

  async clickLoginLink() {
    await this.domHandler.clickWhenReady(this.selectors.loginLink);
  }

  async waitForUrl(expectedUrl) {
    await this.driver.wait(until.urlIs(expectedUrl), this.timeout);
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

}

module.exports = NewAccountPage;
