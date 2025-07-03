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

    const result = await this.verifyBlurValidation(
      this.selectors.passwordInput,
      errorMessage
    );

    return result;
  }

  async verifyBlurValidation(selector, expectedValidation = '', isXPath = false) {
    try {
      const locator = isXPath ? By.xpath(selector) : By.css(selector);
      const element = await this.driver.wait(
        until.elementLocated(locator),
        this.timeout,
        `Element with selector ${selector} not found`
      );
      await this.driver.wait(until.elementIsVisible(element), this.timeout);

      await element.click();
      await this.driver.actions().sendKeys(Key.TAB).perform();

      if (expectedValidation) {
        const errorSelector = this.errorMapping[selector];
        if (!errorSelector) {
          throw new Error(`No error selector defined for ${selector}`);
        }
        const validationElement = await this.driver.wait(
          until.elementLocated(By.xpath(errorSelector)),
          this.timeout,
          `Validation message "${expectedValidation}" not found`
        );
        await this.driver.wait(until.elementIsVisible(validationElement), this.timeout);
        const actualValidation = await validationElement.getText();
        return actualValidation === expectedValidation;
      } else {
        const errorSelector = this.errorMapping[selector] || this.selectors.nameError;
        const elements = await this.driver.findElements(By.xpath(errorSelector));
        return elements.length === 0;
      }
    } catch (error) {
      console.error(`Error verifying onBlur for ${selector}:`, error.message);
      return false;
    }
  }

  async submitWithoutTerms() {
    await this.domHandler.clickWhenReady(this.selectors.termsCheckbox);
  }
  async hasTermsError() {
    return await this.verifyBlurValidation(this.selectors.termsCheckbox, messages.terms, true);
  }
}

module.exports = NewAccountPage;
