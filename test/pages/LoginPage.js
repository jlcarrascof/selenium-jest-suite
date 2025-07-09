// tests/pages/LoginPage.js
const selectors = require("../selectors/loginSelector");
const tabOrderControls = require('../selectors/tabOrderControls');

const DOMHandler = require('../lib/DOMHandler');
const validationMessages = require('../lib/testConfig');

const { By, until, Key } = require('selenium-webdriver');
const TAB_WAIT_TIME = 100;

class LoginPage {
  constructor(driver, baseUrl, timeout) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.selectors = selectors;
    this.domHandler = new DOMHandler(driver, timeout);
  }

  async open() {
    await this.driver.get(this.baseUrl);
  }

  async enterUsername(username) {
    await this.domHandler.fillTextField(this.selectors.usernameInput, username);
  }

  async enterPassword(password) {
    await this.domHandler.fillTextField(this.selectors.passwordInput, password);
  }

  async clickLoginButton() {
    await this.domHandler.clickWhenReady(this.selectors.submitButton);
  }

  async getDashboardTitle() {
    const dashboardElement = await this.driver.wait(
      until.elementLocated(By.css(this.selectors.dashboardTitle)),
      this.timeout
    );
    const result = await dashboardElement.getText();
    return result;
  }

  async getModalText() {
    return await this.domHandler.getModalText(this.selectors.modalMessage);
  }

  async isSubmitButtonDisabled() {
    return await this.domHandler.isButtonDisabled(this.selectors.submitButton);
  }

  async clickRecoverPasswordLink() {
    await this.domHandler.clickWhenReady(this.selectors.recoverPassword);
  }

  async clickNewAccountLink() {
    await this.domHandler.clickWhenReady(this.selectors.newAccount);
  }

  async waitForUrl(expectedUrl) {
    await this.driver.wait(until.urlIs(expectedUrl), this.timeout);
  }

  async clickContactUsLink() {
    await this.domHandler.clickWhenReady(this.selectors.contactUs);
  }

  async ensureRedirectTo(expectedUrl, timeout) {
    try {
      await this.driver.wait(until.urlIs(expectedUrl), timeout);
    } catch {
      await this.driver.get(expectedUrl);
    }
  }

  async focusOnPasswordField() {
    const passwordField = await this.domHandler.findElement(this.selectors.passwordInput);
    await passwordField.click();
  }

  async focusOnUsernameField() {
    const usernameField = await this.domHandler.findElement(this.selectors.usernameInput);
    await usernameField.click();
  }

  async hasUsernameError() {
    return await this.domHandler.isShowingValidationMessageWhenBlur(this.selectors.usernameInput, validationMessages.requiredUsername, false);
  }

  async hasPasswordError() {
    return await this.domHandler.isShowingValidationMessageWhenBlur(this.selectors.passwordInput, validationMessages.requiredPassword, true);
  }

  async focusOnUsernameFieldAndTab() {
    const usernameField = await this.domHandler.findElement(this.selectors.usernameInput);
    await usernameField.click();
    await this.driver.actions().sendKeys(Key.TAB).perform();
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async canPressTabKeysAndNavigateAll() {

    await this.driver.executeScript('document.body.focus();');

    let sentTabs = 0;
    let allPassed = true;

    for (const { selector, name, tabCount, isXPath = false } of tabOrderControls) {
      try {
        const locator = isXPath ? By.xpath(selector) : By.css(selector);
        const expectedElement = await this.driver.wait(
          until.elementLocated(locator),
          this.timeout,

          `Element "${name}" not found with selector: ${selector}`
        );
        await this.driver.wait(
          until.elementIsVisible(expectedElement),
          this.timeout,
          `Element "${name}" not visible with selector: ${selector}`
        );

        const tabsToSend = tabCount - sentTabs;
        sentTabs = tabCount;

        for (let i = 0; i < tabsToSend; i++) {
          await this.driver.actions().sendKeys(Key.TAB).perform();
          await this.driver.sleep(TAB_WAIT_TIME);
        }

        const activeElement = await this.driver.switchTo().activeElement();
        const isFocused = await this.driver.executeScript(
          'return arguments[0] === document.activeElement;',
          expectedElement
        );

        if (!isFocused) {
          allPassed = false;
        }
      } catch (error) {
        allPassed = false;
      }
    }

    return allPassed;
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async getDashboardTitleText() {
    const element = await this.domHandler.waitForElementVisible(this.selectors.dashboardTitle);
    return await element.getText();
  }

}
module.exports = LoginPage;
