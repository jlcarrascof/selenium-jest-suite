// tests/pages/LoginPage.js
const { By, until, Key } = require('selenium-webdriver');
const WAIT_TIME = 2000;
const TAB_WAIT_TIME = 1000;

class LoginPage {
  constructor(driver, timeout) {
    this.driver = driver;
    this.timeout = timeout;

    this.selectors = {
      usernameInput: "input[placeholder='Enter your username']",
      passwordInput: "input[placeholder='Enter your password']",
      submitButton: "button[type='submit']",
      modalMessage: 'div.mb-8.text-md > p'
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

  async getModalMessageText() {
    const modalMsg = await this.driver.wait(
      until.elementLocated(By.css(this.selectors.modalMessage)),
      this.timeout
    );
    return await modalMsg.getText();
  }

  async isSubmitButtonDisabled() {
    const submitBtn = await this.driver.findElement(
      By.css(this.selectors.submitButton)
    );
    return !(await submitBtn.isEnabled());
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
    await this.driver.executeScript('document.body.focus();');
    await this.driver.sleep(WAIT_TIME);
    let sentTabs = 0;

    for (const { selector, name, tabCount, isXPath = false } of controls) {
      const tabsToSend = tabCount - sentTabs;
      sentTabs = tabCount;

      for (let i = 0; i < tabsToSend; i++) {
        await this.driver.actions().sendKeys(Key.TAB).perform();
        await this.driver.sleep(TAB_WAIT_TIME);
      }

      const expected = isXPath
        ? await this.driver.findElement(By.xpath(selector))
        : await this.driver.findElement(By.css(selector));

      const isFocused = await this.driver.executeScript(
        'return arguments[0] === document.activeElement;',
        expected
      );

      if (!isFocused) {
        console.log(
          `Expected focus on "${name}" (selector: ${selector}) after ${tabCount} TABs`
        );
      } else {
        console.log(`✔ Focus on "${name}" after ${tabCount} TABs`);
      }

      return isFocused;
    }
  }
}

module.exports = LoginPage;
