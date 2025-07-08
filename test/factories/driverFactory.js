// tests/factories/driverFactory.js
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromeDriverPath = require('chromedriver').path;

class DriverFactory {
  constructor(browser, timeout) {
    this.browser = browser;
    this.timeout = timeout;
    this.driver = null;
  }

  async initDriver() {
    const service = new chrome.ServiceBuilder(chromeDriverPath); // <- sin .build()
    const options = new chrome.Options();

    this.driver = await new Builder()
      .forBrowser(this.browser)
      .setChromeService(service)
      .setChromeOptions(options)
      .build();

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
