const { By, until, Key } = require('selenium-webdriver');
const validationMessages = require('../lib/testConfig');
const TIMEOUT = 15000;
class DOMHandler {

  constructor(driver, timeout = TIMEOUT) {
    this.driver = driver;
    this.timeout = timeout;
    
  }

  // Form Interactions
  async fillTextField(selector, value) {
    const field = await this.driver.findElement(By.css(selector));
    await field.clear();
    await field.sendKeys(value);
  }

  // General Actions
  async clickWhenReady(selector) {
    const element = await this.findElement(selector);

    await this.driver.wait(until.elementIsVisible(element), this.timeout);
    await this.driver.wait(until.elementIsEnabled(element), this.timeout);
    await element.click();
  }

  // Button Interactions
  async isButtonDisabled(selector) {
    const button = await this.driver.findElement(By.css(selector));
    return !(await button.isEnabled());
  }

  // Modal / Alerts
  async getModalText(selector) {
    const modal = await this.driver.wait(
      until.elementLocated(By.css(selector)),
      this.timeout
    );

    await this.driver.wait(
      async () => {
        const text = await modal.getText();
        return text && text.trim().length > 0;
      },
      this.timeout,
      `Modal text not found in element with selector: ${selector}`
    );

    return await modal.getText();
  }

  async findElement(selector) {
    const locator = selector.startsWith('//') ? By.xpath(selector) : By.css(selector);
    return await this.driver.wait(until.elementLocated(locator), this.timeout);
  }

  async isElementAbsent(selector) {
    const locator = selector.startsWith('//') ? By.xpath(selector) : By.css(selector);
    const elements = await this.driver.findElements(locator);
    return elements.length === 0;
  }

  async waitForUrl(expectedUrl) {
    await this.driver.wait(until.urlIs(expectedUrl), this.timeout);
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async waitForElementVisible(selector, isXPath = false) {
    const locator = isXPath ? By.xpath(selector) : By.css(selector);
    const element = await this.driver.wait(
      until.elementLocated(locator),
      this.timeout,
      `Element with selector "${selector}" not found`
    );
    await this.driver.wait(
      until.elementIsVisible(element),
      this.timeout,
      `Element with selector "${selector}" is not visible`
    );
    return element;
  }

  async makeElementLoseFocus(element) {
      await element.click();
      await this.driver.actions().sendKeys(Key.TAB).perform();
  }

async isShowingValidationMessageWhenBlur(selector, expectedValidation = '', isXPath = false) {
    try {
      const locator = isXPath ? By.xpath(selector) : By.css(selector);
      const element = await this.driver.wait(
        until.elementLocated(locator),
        this.timeout,
        `Element with selector ${selector} not found`
      );
      await this.driver.wait(until.elementIsVisible(element), this.timeout);

      await this.makeElementLoseFocus(element);

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
        await this.driver.manage().setTimeouts({ implicit: 500 });
        const elements = await this.driver.findElements(By.xpath(errorSelector));
        await this.driver.manage().setTimeouts({ implicit: 0 });
        return elements.length === 0;
      }
    } catch (error) {
      console.error(`Error verifying onBlur for ${selector}:`, error.message);
      return false;
    }
  }
}

module.exports = DOMHandler;
