const { By, until } = require('selenium-webdriver');

class LandingPage {
  /**
   * @param {WebDriver} driver
   * @param {string} baseUrl
   * @param {number} timeout
   */
  constructor(driver, baseUrl, timeout) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.loginBtnSelector = 'a.px-4'; // exact selector from original
  }

  /**
   * Navigates to the landing page URL.
   */
  async open() {
    await this.driver.get(this.baseUrl);
  }

  /**
   * Clicks the login button, waiting until visible and enabled.
   */
  async clickLoginButton() {
    const loginBtn = await this.driver.wait(
      until.elementLocated(By.css(this.loginBtnSelector)),
      this.timeout
    );
    await this.driver.wait(until.elementIsVisible(loginBtn), this.timeout);
    await this.driver.wait(until.elementIsEnabled(loginBtn), this.timeout);
    await loginBtn.click();
  }
}

module.exports = LandingPage;
