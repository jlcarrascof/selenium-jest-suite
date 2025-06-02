// tests/factories/driverFactory.js
const { Builder } = require('selenium-webdriver');

class DriverFactory {
  constructor(browser, timeout) {
    this.browser = browser;
    this.timeout = timeout;
    this.driver = null;
  }

  async initDriver() {
    this.driver = await new Builder().forBrowser(this.browser).build();
    await this.driver.manage().setTimeouts({ implicit: this.timeout });
    return this.driver;
  }

  async quitDriver() {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }
}

module.exports = DriverFactory;
