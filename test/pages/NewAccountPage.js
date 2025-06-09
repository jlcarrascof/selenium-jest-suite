// tests/pages/NewAccountPage.js
const { By, until, Key } = require('selenium-webdriver');
const WAIT_TIME = 10000;
const TAB_WAIT_TIME = 500; // wait time after each TAB key press

class NewAccountPage {
  constructor(driver, timeout, baseUrl) { // Añadir baseUrl
    this.driver = driver;
    this.timeout = timeout;
    this.baseUrl = baseUrl; // Inicializar baseUrl

    this.selectors = {
      nameInput: "input[placeholder='Enter your name']",
      surnameInput: "input[placeholder='Enter your surname']",
      emailInput: "input[placeholder='Email']",
      usernameInput: "input[placeholder='Username']",
      passwordInput: "input[placeholder='Password']",
      confirmPasswordInput: "input[placeholder='Confirm Password']",
      termsCheckbox: "input[type='checkbox']",
      createButton: "button[type='submit']"
    };
  }

  async open() {
    await this.driver.get(this.baseUrl);
    await this.driver.wait(until.urlContains(this.baseUrl), this.timeout);
  }

  async verifyBlurValidation(selector, expectedValidation = '', isXPath = false) {
    const { By, until } = require('selenium-webdriver');
    try {
      const locator = isXPath ? By.xpath(selector) : By.css(selector);
      const element = await this.driver.wait(
        until.elementLocated(locator),
        this.timeout
      );
      await element.click();
      await this.driver.actions().sendKeys(Key.TAB).perform();

      if (expectedValidation) {
        let errorSelector = '';
        if (selector === this.selectors.nameInput) {
          errorSelector = "//p[contains(normalize-space(.),'Enter your name')]";
        } else if (selector === this.selectors.surnameInput) {
          errorSelector = "//p[contains(normalize-space(.),'Enter your surname')]";
        } else if (selector === this.selectors.emailInput) {
          errorSelector = "//p[contains(normalize-space(.),'Please enter a valid email')]";
        } else if (selector === this.selectors.usernameInput) {
          errorSelector = "//p[contains(normalize-space(.),'Username is required')]";
        } else if (selector === this.selectors.passwordInput) {
          errorSelector = "//p[contains(normalize-space(.),'Enter your password')]";
        } else if (selector === this.selectors.confirmPasswordInput) {
          errorSelector = "//p[contains(normalize-space(.),'Confirm password')]";
        }
        const validationElement = await this.driver.wait(
          until.elementLocated(By.xpath(errorSelector)),
          this.timeout
        );
        const actualValidation = await validationElement.getText();
        return actualValidation === expectedValidation;
      }
      return true;
    } catch (error) {
      console.error(`Error verifying onBlur for ${selector}:`, error.message);
      return false;
    }
  }
}

module.exports = NewAccountPage;
