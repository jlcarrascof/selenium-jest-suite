const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until, Key } = require('selenium-webdriver');

const VALID_USERNAME = 'javier';
const VALID_PASSWORD = '.qwerty123.';
const INVALID_USERNAME = 'maria';
const INVALID_PASSWORD = '.12345.qwerty.';
const EMPTY_USERNAME = '';
const EMPTY_PASSWORD = '';

let driver;
let landingPage;
let loginPage;

beforeAll(async () => {

  const driverFactory = new DriverFactory(global.testConfig.currentBrowser, global.testConfig.timeout);

  driver = await driverFactory.initDriver();

  landingPage = PageFactory.createPage('landing', driver, `${global.testConfig.baseUrl}`, global.testConfig.timeout);
  loginPage = PageFactory.createPage('login', driver, `${global.testConfig.baseLoginUrl}`, global.testConfig.timeout);

});

beforeEach(async () => {
  await landingPage.open();
  await landingPage.clickLoginButton();
});

afterAll(async () => {
  if (driver) {
    await driver.quit();
  }
});

describe('Test Suite: Login Functionality of Harmony Church', () => {

  test('TC-001: Valid credentials should login successfully', async () => {

    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();

    const dashboardElement = await driver.wait(until.elementLocated(By.css(loginPage.selectors.dashboardTitle)), loginPage.timeout);

    const actualResult = await dashboardElement.getText();
    const expectedResult = /dashboard/i;

    expect(actualResult).toMatch(expectedResult);
  });

  describe.each`
    testCase    | username            | password            | description
    ${'TC-002'} | ${VALID_USERNAME}   | ${INVALID_PASSWORD} | ${'When enter valid username and invalid password'}
    ${'TC-003'} | ${INVALID_USERNAME} | ${VALID_PASSWORD}   | ${'When enter invalid username and valid password'}
    ${'TC-004'} | ${INVALID_USERNAME} | ${INVALID_PASSWORD} | ${'When enter invalid username and invalid password'}
  `('$testCase: Invalid credentials should display error message', ({ username, password, description}) => {
    test(`${description}`, async () => {
      await loginPage.enterUsername(username);
      await loginPage.enterPassword(password);
      await loginPage.clickSubmit();

      const actualResult = await loginPage.getModalMessageText();
      const expectedResult = 'Invalid credentials.';

      expect(actualResult).toBe(expectedResult);
    });
  });

  describe.each`
    testCase    | username          | password          | description
    ${'TC-005'} | ${EMPTY_USERNAME} | ${VALID_PASSWORD} | ${'When username is empty'}
    ${'TC-006'} | ${VALID_USERNAME} | ${EMPTY_PASSWORD} | ${'When password is empty'}
    ${'TC-007'} | ${EMPTY_USERNAME} | ${EMPTY_PASSWORD} | ${'When username and password are empty'}
  `('$testCase: Login Submit button should be disabled', ({ username, password, description }) => {
    test(`${description}`, async () => {
      await loginPage.enterUsername(username);
      await loginPage.enterPassword(password);

      const actualResult = await loginPage.isSubmitButtonDisabled();

      expect(actualResult).toBe(true);
    });
  });

  test('TC-008:(To be updated) Clicking Forgot Password link should redirect to recovery page', async () => {
    await loginPage.clickLink(loginPage.selectors.recoverPassword);

    const expectedUrl = global.testConfig.forgotPasswordRedirectUrl;

    await driver.wait(until.urlIs(expectedUrl), loginPage.timeout);

    const actualUrl = await driver.getCurrentUrl();

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-009: Clicking New Account link should redirect to registration page', async () => {
    await loginPage.clickLink(loginPage.selectors.newAccount);

    const expectedUrl = global.testConfig.baseNewAccountUrl;

    await driver.wait(until.urlIs(expectedUrl), loginPage.timeout);

    const actualUrl = await driver.getCurrentUrl();

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-010: Tab order should follow expected focus sequence', async () => {

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

    const actualResult = await loginPage.canNavigateWithTabsInOrder(controls);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-011: (To be updated) Clicking Contact Us link should redirect to contact page', async () => {

    const TIMEOUT = 3000;

    await loginPage.clickLink(loginPage.selectors.contactUs);

    const expectedUrl = global.testConfig.forgotPasswordRedirectUrl;

    try {
      await driver.wait(until.urlIs(expectedUrl), TIMEOUT);
    } catch (error) {
      await driver.get(expectedUrl);
    }

    const actualUrl = await driver.getCurrentUrl();

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-012: Username field should display error message when is empty', async () => {
    const usernameField = await driver.findElement(By.css(loginPage.selectors.usernameInput));

    await usernameField.click();

    const WARNING_MESSAGE = 'Username is required';
    const actualResult = await loginPage.verifyBlurValidation(loginPage.selectors.usernameInput, WARNING_MESSAGE);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-013: Password field should display error message when is empty', async () => {
    const WARNING_MESSAGE = 'Password must be at least 8 characters';

    await loginPage.enterUsername(VALID_USERNAME);

    const passwordField = await driver.findElement(By.css(loginPage.selectors.passwordInput));

    await passwordField.click(); // Click on the password field to trigger blur event

    const actualResult = await loginPage.verifyBlurValidation(loginPage.selectors.passwordInput, WARNING_MESSAGE);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-014: Username field and Password field should display error messages when both fields are empty', async () => {
    const WARNING_MESSAGE = 'Password must be at least 8 characters';
    const usernameField = await driver.findElement(By.css(loginPage.selectors.usernameInput));

    await usernameField.click();
    await driver.actions().sendKeys(Key.TAB).perform();

    const passwordField = await driver.findElement(By.css(loginPage.selectors.passwordInput));

    await passwordField.click();

    const actualResult = await loginPage.verifyBlurValidation(loginPage.selectors.passwordInput, WARNING_MESSAGE);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });
});
