// tests/pages/LoginPage.js
const { By, until, Key } = require('selenium-webdriver');
const TAB_WAIT_TIME = 500; // wait time after each TAB key press

class LoginPage {
  constructor(driver, baseUrl, timeout) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;

    this.selectors = {
      dashboardTitle: 'h1.text-xl.font-semibold',
      contactUs: 'button.font-semibold.text-hprimary',
      recoverPassword: 'form > div.flex.flex-row.gap-2.justify-between > a',
      newAccount: "a[href*='user-signup']",
      usernameInput: "input[placeholder='Enter your username']",
      passwordInput: "input[placeholder='Enter your password']",
      submitButton: "button[type='submit']",
      modalMessage: 'div.mb-8.text-md > p',
      usernameError: "//p[contains(normalize-space(.),'Username is required')]",
      passwordError: "//p[contains(normalize-space(.),'Password must be at least 8 characters')]",
    };
  }

  async open() {
    await this.driver.get(this.baseUrl);
  }

  async login(username, password) {
    await loginPage.open();
    await loginPage.enterUsername(username);
    await loginPage.enterPassword(password);
    await loginPage.clickSubmit();
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
     console.log(`Clicked on element with selector: ${selector}`);
    // wait for the page to load
    await this.driver.sleep(this.timeout);

    const url = await this.driver.getCurrentUrl();

    return url;
  }

  async canNavigateWithTabsInOrder(controls) {
    const { By, Key, until } = require('selenium-webdriver');
    await this.driver.executeScript('document.body.focus();');
    let sentTabs = 0;
    let allPassed = true;

    for (const { selector, name, tabCount, isXPath = false } of controls) {
      try {
        // wait for the element to be located and visible
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

        // send TABs to reach the expected element
        const tabsToSend = tabCount - sentTabs;
        sentTabs = tabCount;

        for (let i = 0; i < tabsToSend; i++) {
          await this.driver.actions().sendKeys(Key.TAB).perform();
          await this.driver.sleep(TAB_WAIT_TIME);
        }

        // verify if the expected element is focused
        const activeElement = await this.driver.switchTo().activeElement();
        const isFocused = await this.driver.executeScript(
          'return arguments[0] === document.activeElement;',
          expectedElement
        );

        if (!isFocused) {
          const activeElementHTML = await activeElement.getAttribute('outerHTML');
          console.log(
            `❌ Expected focus on "${name}" (selector: ${selector}) after ${tabCount} TABs, but focus is on: ${activeElementHTML}`
          );
          allPassed = false;
        } else {
          console.log(`✔ Focus on "${name}" after ${tabCount} TABs`);
        }
      } catch (error) {
        console.error(`Error to focus "${name}" with selector ${selector}:`, error.message);
        allPassed = false;
      }
    }

    return allPassed;
  }

  async verifyBlurValidation(selector, expectedValidation = '', isXPath = false) {
    const { By, Key, until } = require('selenium-webdriver');
    try {
      const locator = isXPath ? By.xpath(selector) : By.css(selector);
      const element = await this.driver.wait(
        until.elementLocated(locator),
        this.timeout,
        `Element with selector ${selector} not found`
      );
      await this.driver.wait(until.elementIsVisible(element), this.timeout);

      await element.click();
      await this.driver.actions().sendKeys(Key.TAB).perform();

      if (expectedValidation) {
        const errorSelector = selector === this.selectors.usernameInput
          ? this.selectors.usernameError
          : this.selectors.passwordError;
        const validationElement = await this.driver.wait(
          until.elementLocated(By.xpath(errorSelector)),
          this.timeout,
          `Validation message "${expectedValidation}" not found`
        );
        await this.driver.wait(until.elementIsVisible(validationElement), this.timeout);
        const actualValidation = await validationElement.getText();
        return actualValidation === expectedValidation;
      } else {
        const errorSelector = selector === this.selectors.usernameInput
          ? this.selectors.usernameError
          : this.selectors.passwordError;
        const elements = await this.driver.findElements(By.xpath(errorSelector));
        return elements.length === 0;
      }
    } catch (error) {
      console.error(`Error verifying onBlur for ${selector}:`, error.message);
      return false;
    }
  }
}

module.exports = LoginPage;
