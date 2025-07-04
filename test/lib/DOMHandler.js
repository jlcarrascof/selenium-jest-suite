const { By, until } = require('selenium-webdriver');
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

    async findVisibleElements(selector, isXPath = false) {
      const locator = isXPath ? By.xpath(selector) : By.css(selector);
      const all = await this.driver.findElements(locator);
      const visible = [];

      for (const el of all) {
        if (await el.isDisplayed()) {
          visible.push(el);
        }
      }

      return visible;
  }

}

module.exports = DOMHandler;
