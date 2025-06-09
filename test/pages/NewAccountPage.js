// tests/pages/NewAccountPage.js
const { By, until, Key } = require('selenium-webdriver');

class NewAccountPage {
  constructor(driver, baseUrl, timeout) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;

    this.selectors = {
      nameInput: "input[placeholder='Enter your name']",
      surnameInput: "input[placeholder='Enter your surname']",
      emailInput: "input[placeholder='Enter your email']",
      usernameInput: "input[placeholder='Enter your username']",
      passwordInput: "input[placeholder='Enter your password']",
      confirmPasswordInput: "input[placeholder='Repeat Password']",
      termsCheckboxInput: "input[type='checkbox']",
      createButton: "button[type='submit']",
      nameError: "//p[contains(normalize-space(.),'Name is required')]",
      surnameError: "//p[contains(normalize-space(.),'Surname is required')]",
      emailError: "//p[contains(normalize-space(.),'Please enter a valid email')]",
      usernameError: "//p[contains(normalize-space(.),'Username is required')]",
      passwordError: "//p[contains(normalize-space(.),'Password must be at least 8 characters')]"
    };

    this.errorMapping = {
      [this.selectors.nameInput]: this.selectors.nameError,
      [this.selectors.surnameInput]: this.selectors.surnameError,
      [this.selectors.emailInput]: this.selectors.emailError,
      [this.selectors.usernameInput]: this.selectors.usernameError,
      [this.selectors.passwordInput]: this.selectors.passwordError
    };
  }

  async open() {
    await this.driver.get(this.baseUrl);
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
        const errorSelector = this.errorMapping[selector] || this.selectors.nameError; // Valor por defecto si no hay mapeo
        const elements = await this.driver.findElements(By.xpath(errorSelector));
        return elements.length === 0;
      }
    } catch (error) {
      console.error(`Error verifying onBlur for ${selector}:`, error.message);
      return false;
    }
  }
}

module.exports = NewAccountPage;
