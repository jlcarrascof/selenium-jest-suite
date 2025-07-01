// tests/pages/LoginPage.js
const selectors = require("../selectors/loginSelector");
const { fillTextField } = require("../lib/fieldActions");
const { clickButton, isButtonDisabled } = require("../lib/formActions");
const { getModalText } = require("../lib/textModalActions");

const { By, until, Key } = require('selenium-webdriver');
const TAB_WAIT_TIME = 100;

class LoginPage {
  constructor(driver, baseUrl, timeout) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.selectors = selectors;
  }

  async open() {
    await this.driver.get(this.baseUrl);
  }

  async enterUsername(username) {
    await fillTextField(this.driver, this.selectors.usernameInput, username);
  }

  async enterPassword(password) {
    await fillTextField(this.driver, this.selectors.passwordInput, password);
  }


  // ojo
  /*
  async submit() {
    await clickWhenReady(this.driver, this.selectors.submitButton, this.timeout);
  }
  */

  async submitForm() {
    await clickButton(this.driver, this.selectors.submitButton, this.timeout);
  }

  async getModalText() {
    return await getModalText(this.driver, this.selectors.modalMessage, this.timeout);
  }

  async isSubmitButtonDisabled() {
    return await isButtonDisabled(this.driver, this.selectors.submitButton);
  }

  getSelectors() {
    return this.selectors;
  }

  async clickLink(selector) {
    const element = await this.driver.wait(
      until.elementLocated(By.css(selector)),
      this.timeout
    );

    await this.driver.wait(until.elementIsVisible(element), this.timeout);
    await this.driver.wait(until.elementIsEnabled(element), this.timeout);
    await element.click();
  }

  async canNavigateWithTabsInOrder(controls) {
    const { By, Key, until } = require('selenium-webdriver');

    await this.driver.executeScript('document.body.focus();');

    let sentTabs = 0;
    let allPassed = true;

    for (const { selector, name, tabCount, isXPath = false } of controls) {
      try {
        const locator = isXPath ? By.xpath(selector) : By.css(selector);
        const expectedElement = await this.driver.wait(
          until.elementLocated(locator),
          this.timeout,

          `Element "${name}" not found with selector: ${selector}`
        );
        await this.driver.wait(
          until.elementIsVisible(expectedElement),
          this.timeout,
          `Element "${name}" not visible with selector: ${selector}`
        );

        const tabsToSend = tabCount - sentTabs;
        sentTabs = tabCount;

        for (let i = 0; i < tabsToSend; i++) {
          await this.driver.actions().sendKeys(Key.TAB).perform();
          await this.driver.sleep(TAB_WAIT_TIME);
        }

        const activeElement = await this.driver.switchTo().activeElement();
        const isFocused = await this.driver.executeScript(
          'return arguments[0] === document.activeElement;',
          expectedElement
        );

        if (!isFocused) {
          const activeElementHTML = await activeElement.getAttribute('outerHTML');
          allPassed = false;
        }
      } catch (error) {
        allPassed = false;
      }
    }

    return allPassed;
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
        const errorSelector = selector === this.selectors.usernameInput
          ? this.selectors.usernameError
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

module.exports = LoginPage;
