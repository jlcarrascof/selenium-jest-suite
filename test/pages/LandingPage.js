const { By, until } = require('selenium-webdriver');

class LandingPage {
  constructor(driver, baseUrl, timeout) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.loginBtnSelector = 'a.px-4'; // exact selector from original

    this.selectors = {
      loginBtn : 'a.px-4'
    };
  }

  async open() {
    await this.driver.get(this.baseUrl + '/landing');
  }

  /**
   * Clicks the login button, waiting until visible and enabled.
   */
  async clickLoginButton() {
    const loginBtn = await this.driver.wait(
      until.elementLocated(By.css(this.selectors.loginBtn)),
      this.timeout
    );
    await this.driver.wait(until.elementIsVisible(loginBtn), this.timeout);
    await this.driver.wait(until.elementIsEnabled(loginBtn), this.timeout);
    await loginBtn.click();
  }
}

module.exports = LandingPage;
