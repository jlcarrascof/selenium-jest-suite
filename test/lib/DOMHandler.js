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
    const element = await this.driver.wait(
      until.elementLocated(By.css(selector)),
      this.timeout
    );
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
    return await modal.getText();
  }
}

module.exports = DOMHandler;
