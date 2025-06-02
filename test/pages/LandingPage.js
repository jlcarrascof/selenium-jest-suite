const { By } = require('selenium-webdriver');

export class LandingPage {
  /**
   * @param {WebDriver} driver
   */
  constructor(driver) {
    this.driver = driver;
    this.selectors = {
      loginLink: By.css('a.px-4'),
    };
  }

  async clickLoginLink() {
    await this.driver.findElement(this.selectors.loginLink).click();
  }

  async isLoaded() {
    return await this.driver.findElement(this.selectors.loginLink).isDisplayed();
  }
}
