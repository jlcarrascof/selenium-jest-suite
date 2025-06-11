// tests/pages/LoginPage.js
const { By, until, Key } = require('selenium-webdriver');
const WAIT_TIME = 10000;
const TAB_WAIT_TIME = 500; // wait time after each TAB key press

class ProfilePage {
  constructor(driver, timeout) {
    this.driver = driver;
    this.timeout = timeout;

    this.selectors = {
      usernameInput: "input[placeholder='Enter your username']",
      passwordInput: "input[placeholder='Enter your password']",
      submitButton: "button[type='submit']",
    };
  }

  async enterUsername(username) {
    const usernameField = await this.driver.findElement(
      By.css(this.selectors.usernameInput)
    );
    await usernameField.clear();
    await usernameField.sendKeys(username);
  }

  async enterPassword(password) {
    const passwordField = await this.driver.findElement(
      By.css(this.selectors.passwordInput)
    );
    await passwordField.clear();
    await passwordField.sendKeys(password);
  }

  async clickSubmit() {
    const submitBtn = await this.driver.wait(
      until.elementLocated(By.css(this.selectors.submitButton)),
      this.timeout
    );
    await this.driver.wait(until.elementIsVisible(submitBtn), this.timeout);
    await this.driver.wait(until.elementIsEnabled(submitBtn), this.timeout);
    await submitBtn.click();
  }

  async isSubmitButtonDisabled() {
    const submitBtn = await this.driver.findElement(
      By.css(this.selectors.submitButton)
    );
    return !(await submitBtn.isEnabled());
  }

}

module.exports = ProfilePage;
