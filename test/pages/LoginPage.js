// tests/pages/LoginPage.js
const { By, until, Key } = require('selenium-webdriver');

class LoginPage {
  /**
   * @param {WebDriver} driver
   * @param {number} timeout
   */
  constructor(driver, timeout) {
    this.driver = driver;
    this.timeout = timeout;

    // exact selectors from original LoginHelper
    this.selectors = {
      usernameInput: "input[placeholder='Enter your username']",
      passwordInput: "input[placeholder='Enter your password']",
      submitButton: "button[type='submit']",
      modalMessage: 'div.mb-8.text-md > p'
    };
  }

  /**
   * Enters username into its input field.
   * @param {string} username
   */
  async enterUsername(username) {
    const usernameField = await this.driver.findElement(
      By.css(this.selectors.usernameInput)
    );
    await usernameField.clear();
    await usernameField.sendKeys(username);
  }

  /**
   * Enters password into its input field.
   * @param {string} password
   */
  async enterPassword(password) {
    const passwordField = await this.driver.findElement(
      By.css(this.selectors.passwordInput)
    );
    await passwordField.clear();
    await passwordField.sendKeys(password);
  }

  /**
   * Clicks the login/submit button, waiting until it's visible and enabled.
   */
  async clickSubmit() {
    const submitBtn = await this.driver.wait(
      until.elementLocated(By.css(this.selectors.submitButton)),
      this.timeout
    );
    await this.driver.wait(until.elementIsVisible(submitBtn), this.timeout);
    await this.driver.wait(until.elementIsEnabled(submitBtn), this.timeout);
    await submitBtn.click();
  }

  /**
   * Returns the text of the error message for invalid credentials.
   * @returns {Promise<string>}
   */
  async getModalMessageText() {
    const modalMsg = await this.driver.wait(
      until.elementLocated(By.css(this.selectors.modalMessage)),
      this.timeout
    );
    return await modalMsg.getText();
  }

  /**
   * Returns true if the submit button is disabled.
   * @returns {Promise<boolean>}
   */
  async isSubmitButtonDisabled() {
    const submitBtn = await this.driver.findElement(
      By.css(this.selectors.submitButton)
    );
    return !(await submitBtn.isEnabled());
  }

  /**
   * Clicks any link by its CSS selector, waits for redirection, returns the new URL.
   * @param {string} selector
   * @param {number} waitTime - milliseconds to wait after click for navigation
   * @returns {Promise<string>}
   */
  async clickLink(selector, waitTime) {
    const element = await this.driver.wait(
      until.elementLocated(By.css(selector)),
      this.timeout
    );
    await this.driver.wait(until.elementIsVisible(element), this.timeout);
    await this.driver.wait(until.elementIsEnabled(element), this.timeout);
    await element.click();

    if (waitTime > 0) {
      await this.driver.sleep(waitTime);
    }

    return await this.driver.getCurrentUrl();
  }

  /**
   * Navigates through elements with TAB key according to the provided controls array.
   * @param {Array<{selector: string, name: string, tabCount: number, isXPath?: boolean}>} controls
   * @returns {Promise<boolean>}
   */
  async canNavigateWithTabsInOrder(controls) {
    await this.driver.executeScript('document.body.focus();');
    await this.driver.sleep(200);
    let sentTabs = 0;

    for (const { selector, name, tabCount, isXPath = false } of controls) {
      const tabsToSend = tabCount - sentTabs;
      sentTabs = tabCount;

      for (let i = 0; i < tabsToSend; i++) {
        await this.driver.actions().sendKeys(Key.TAB).perform();
        await this.driver.sleep(150);
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
