const { Builder, By, until, Key } = require('selenium-webdriver');

class LoginHelper {
  static currentBrowser;
  static timeout;
  static driver;

  static init(browser, timeout) {
      this.currentBrowser = browser;
      this.timeout = timeout;
  }

  static async initDriver() {
      this.driver = await new Builder().forBrowser(this.currentBrowser).build();
      await this.driver.manage().setTimeouts({ implicit: this.timeout });
  }

  static async getDriver() {
      return this.driver;
  }


  static async landingPageLoginBtnClick() {
    // Selectors
    const loginBtnSelector = 'a.px-4';

    await this.driver.get(BASE_URL);

    const loginBtn = await this.driver.wait(until.elementLocated(By.css(loginBtnSelector)), TIMEOUT);

    await this.driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
    await this.driver.wait(until.elementIsEnabled(loginBtn), TIMEOUT);

    await loginBtn.click();
  }

  static async enterFieldsUsernameAndPassword(username, password) {
       // Selectors
       const inputUsernameSelector = "input[placeholder='Enter your username']";
       const inputPasswordSelector = "input[placeholder='Enter your password']";

       await this.driver.findElement(By.css(inputUsernameSelector)).sendKeys(username);
       await this.driver.findElement(By.css(inputPasswordSelector)).sendKeys(password);
  }

  static async loginBtnClick() {

    // Selectors
    const submitBtnSelector = "button[type='submit']";

    const submitLoginBtn = await this.driver.wait(until.elementLocated(By.css(submitBtnSelector)), TIMEOUT);

    await this.driver.wait(until.elementIsVisible(submitLoginBtn), TIMEOUT);
    await this.driver.wait(until.elementIsEnabled(submitLoginBtn), TIMEOUT);

    await submitLoginBtn.click();
  }

    static async loginWithInvalidCredentialsMessageTextError(username, password) {
    // Selectors
    const modalMessageSelector = 'div.mb-8.text-md > p';

    await LoginHelper.enterFieldsUsernameAndPassword(username, password);
    await LoginHelper.loginBtnClick();

    const modalMessage = await this.driver.wait(until.elementLocated(By.css(modalMessageSelector)), TIMEOUT);
    const modalMessageText = await modalMessage.getText();

    return modalMessageText;

  }

  static async loginBtnExpectedToBeDisabled(username, password) {

    // Selectors
    const submitLoginBtnSelector = "button[type='submit']";

    await LoginHelper.enterFieldsUsernameAndPassword(username, password);

    const submitLoginBtn = await this.driver.findElement(By.css(submitLoginBtnSelector));

    const isDisabled = !(await submitLoginBtn.isEnabled());

   return isDisabled;
  }

  static async loginClickLink(selector, waitTime) {
    // Locate the element
    const element = await this.driver.wait(until.elementLocated(By.css(selector)), TIMEOUT);
    await this.driver.wait(until.elementIsVisible(element), TIMEOUT);
    await this.driver.wait(until.elementIsEnabled(element), TIMEOUT);

    // Click on the element
    await element.click();

    // Wait for redirection
    if (waitTime > 0) {
      await this.driver.sleep(waitTime);
    }

    // return the actual URL
    return await this.driver.getCurrentUrl();
  }

  static async canNavigateWithTabsInOrder(controls) {

    // Reset focus to <body> so the very first TAB goes to the first control
    await this.driver.executeScript('document.body.focus();');
    await this.driver.sleep(200);

    let sentTabs = 0;

    for (const { selector, name, tabCount, isXPath = false } of controls) {
      // Only send the new TABs needed
      const tabsToSend = tabCount - sentTabs;
      sentTabs = tabCount;

      for (let i = 0; i < tabsToSend; i++) {
        await this.driver.actions().sendKeys(Key.TAB).perform();
        await this.driver.sleep(150);
      }

      // Locate expected element via CSS or XPath
      const expected = isXPath
        ? await this.driver.findElement(By.xpath(selector))
        : await this.driver.findElement(By.css(selector));

      // Assert it’s the focused element
      const isFocused = await this.driver.executeScript(
        'return arguments[0] === document.activeElement;',
        expected
      );

      if (!isFocused) {
        console.log(`Expected focus on "${name}" (selector: ${selector}) after ${tabCount} TABs`);
      }
      else{
        console.log(`✔ Focus on "${name}" after ${tabCount} TABs`);
      }

      return isFocused;
    }
  }

  static async disposeDriver() {
      if (this.driver) {
          await this.driver.quit();
          this.driver = null;
      }
  }
}

const TIMEOUT = 120000;
const BASE_URL = 'https://qa.harmonychurchsuite.com/landing';
const VALID_USERNAME = 'javier';
const VALID_PASSWORD = '.qwerty123.';
const INVALID_USERNAME = 'maria';
const INVALID_PASSWORD = '.12345.qwerty.';
const CURRENT_BROWSER = 'chrome';
const EMPTY_USERNAME = '';
const EMPTY_PASSWORD = '';

beforeAll(async () => {
  LoginHelper.init(CURRENT_BROWSER, TIMEOUT);
  await LoginHelper.initDriver()
  this.driver = await LoginHelper.getDriver();
});

afterAll(async () => {
  LoginHelper.disposeDriver();
});

describe('Test Suite: Login Functionality of Harmony Church', () => {

  /*
  test('TC-001: Valid credentials should login successfully', async () => {

    // Selector
    const dashboardUrlSelector = 'h1.text-xl.font-semibold';

    await LoginHelper.landingPageLoginBtnClick();
    await LoginHelper.enterFieldsUsernameAndPassword(VALID_USERNAME, VALID_PASSWORD);
    await LoginHelper.loginBtnClick();

    const dashboardUrl = await this.driver.wait(until.elementLocated(By.css(dashboardUrlSelector)), TIMEOUT);

    const actualResult = await dashboardUrl.getText();
    const expectedResult = /dashboard/i

    expect(actualResult).toMatch(expectedResult);
  });

  test('TC-002: Invalid credentials (valid username, invalid password) should display error message', async () => {
    await LoginHelper.landingPageLoginBtnClick();
    const modalMessageText = await LoginHelper.loginWithInvalidCredentialsMessageTextError(VALID_USERNAME, INVALID_PASSWORD);

    const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials.';
    const actualResult = modalMessageText === INVALID_CREDENTIALS_MESSAGE;
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  })

  test('TC-003: Invalid credentials (invalid username, valid password) should display error message', async () => {
    await LoginHelper.landingPageLoginBtnClick();
    const modalMessageText = await LoginHelper.loginWithInvalidCredentialsMessageTextError(INVALID_USERNAME, VALID_PASSWORD);

    const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials.';
    const actualResult = modalMessageText === INVALID_CREDENTIALS_MESSAGE;
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  })

  test('TC-004: Invalid credentials (invalid username, invalid password) should display error message', async () => {
    await LoginHelper.landingPageLoginBtnClick();
    const modalMessageText = await LoginHelper.loginWithInvalidCredentialsMessageTextError(INVALID_USERNAME, INVALID_PASSWORD);

    const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials.';
    const actualResult = modalMessageText === INVALID_CREDENTIALS_MESSAGE;
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  })

  test('TC-005: Login Submit button should be disabled when username is empty', async () => {
    await LoginHelper.landingPageLoginBtnClick();

    const actualResult = await LoginHelper.loginBtnExpectedToBeDisabled(EMPTY_USERNAME, VALID_PASSWORD);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-006: Login Submit button should be disabled when password is empty', async () => {
    await LoginHelper.landingPageLoginBtnClick();

    const actualResult = await LoginHelper.loginBtnExpectedToBeDisabled(VALID_USERNAME, EMPTY_PASSWORD);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-007: Login Submit button should be disabled when username and password are empty', async () => {
    await LoginHelper.landingPageLoginBtnClick();

    const actualResult = await LoginHelper.loginBtnExpectedToBeDisabled(EMPTY_USERNAME, EMPTY_PASSWORD);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-010: Clicking Forgot Password link should redirect to recovery page', async () => {
    // Selectors

    const selector = 'form > div.flex.flex-row.gap-2.justify-between > a'

    await LoginHelper.landingPageLoginBtnClick();

    const actualUrl = await LoginHelper.loginClickLink(selector, TIMEOUT);
    const expectedUrl = `${BASE_URL}/recover-password`;

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-011: Clicking New Account link should redirect to registration page', async () => {
    const selector = "a[href*='user-signup']";

    await LoginHelper.landingPageLoginBtnClick();

    const actualUrl = await LoginHelper.loginClickLink(selector, TIMEOUT);
    const expectedUrl = 'https://login.harmonychurchsuite.com/tenant/user-signup?tenant=qa';

    expect(actualUrl).toBe(expectedUrl);
  });
  */
  /*
  test('TC-012: Tab order should follow expected focus sequence', async () => {
    const controls = [
      {
        selector: "//button[contains(normalize-space(.),'Sign in with Google')]",
        name: 'Sign in with Google',
        tabCount: 1,
        isXPath: true
      },
      {
        selector: "//button[contains(normalize-space(.),'Sign in with Apple')]",
        name: 'Sign in with Apple',
        tabCount: 2,
        isXPath: true
      },
      {
        selector: 'input[placeholder="Enter your username"]',
        name: 'Username',
        tabCount: 3
      },
      {
        selector: 'input[placeholder="Enter your password"]',
        name: 'Password',
        tabCount: 4
      },
      {
        selector: "//input[@placeholder='Enter your password']/following-sibling::button",
        name: 'Password Toggle',
        tabCount: 5,
        isXPath: true
      },
      {
        selector: 'input#checkbox[type="checkbox"]',
        name: 'Remember Me',
        tabCount: 6
      },
      {
        selector: "//a[normalize-space(.)='Forgot Password?']",
        name: 'Forgot Password',
        tabCount: 7,
        isXPath: true
      },
      {
        selector: "//a[normalize-space(.)='New Account']",
        name: 'New Account',
        tabCount: 8,
        isXPath: true
      },
      {
        selector: 'menu-context-language button.dropdown-toggle',
        name: 'Language Selector',
        tabCount: 9
      },
      {
        selector: "//button[normalize-space(.)='Contact Us']",
        name: 'Contact Us',
        tabCount: 10,
        isXPath: true
      }
    ];

    await LoginHelper.landingPageLoginBtnClick();

    const actualResult =  await LoginHelper.canNavigateWithTabsInOrder(controls);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });
*/

  test('TC-019: Clicking Contact Us button should redirect to contact page', async () => {
    // Selector


    await LoginHelper.landingPageLoginBtnClick();

    const actualUrl = await LoginHelper.loginClickLink(selector, TIMEOUT);
    const expectedUrl = `${BASE_URL}/contact-us`; // example of expected URL

    expect(actualUrl).toBe(expectedUrl);
  });

});
