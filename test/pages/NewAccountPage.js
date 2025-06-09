// tests/pages/NewAccountPage.js
const { By, until, Key } = require('selenium-webdriver');

class NewAccountPage {
  constructor(driver, baseUrl, timeout) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;

    this.selectors = {
      nameInput: "input[placeholder='Enter your name']",
      surname: "input[placeholder='Enter your surname']",
      email: "input[placeholder='Email']",
      username: "input[placeholder='Username']",
      password: "input[placeholder='Password']",
      confirmPassword: "input[placeholder='Confirm Password']",
      termsCheckbox: "input[type='checkbox']",
      createButton: "button[type='submit']",
      nameError: "//p[contains(normalize-space(.),'Name is required')]"
    };
  }

  async open() {
    await this.driver.get(this.baseUrl);
  }

  async verifyBlurValidation(selector, expectedValidation = '', isXPath = false) {
    const { By, Key, until } = require('selenium-webdriver');
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
        const errorSelector = selector === this.selectors.nameInput
          ? this.selectors.nameError
          : this.selectors.passwordError;
        const validationElement = await this.driver.wait(
          until.elementLocated(By.xpath(errorSelector)),
          this.timeout,
          `Validation message "${expectedValidation}" not found`
        );
        await this.driver.wait(until.elementIsVisible(validationElement), this.timeout);
        const actualValidation = await validationElement.getText();
        return actualValidation === expectedValidation;
      } else {
        const errorSelector = selector === this.selectors.usernameInput
          ? this.selectors.usernameError
          : this.selectors.passwordError;
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
