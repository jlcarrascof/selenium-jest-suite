const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until, Key } = require('selenium-webdriver');

const TIMEOUT = 120000;
const BASE_URL = 'https://qa.harmonychurchsuite.com/landing';
const VALID_USERNAME = 'javier';
const VALID_PASSWORD = '.qwerty123.';
const INVALID_USERNAME = 'maria';
const INVALID_PASSWORD = '.12345.qwerty.';
const CURRENT_BROWSER = 'chrome';
const EMPTY_USERNAME = '';
const EMPTY_PASSWORD = '';
const DASHBOARD_TITLE_SELECTOR = 'h1.text-xl.font-semibold';
const RECOVER_PASSWORD_SELECTOR = 'form > div.flex.flex-row.gap-2.justify-between > a';
const NEW_ACCOUNT_SELECTOR = "a[href*='user-signup']";
const CONTACT_US_SELECTOR = "button.font-semibold.text-hprimary";

let driver;
let landingPage;
let loginPage;

beforeAll(async () => {
  const driverFactory = new DriverFactory(CURRENT_BROWSER, TIMEOUT);
  driver = await driverFactory.initDriver();
  landingPage = PageFactory.createPage('landing', driver, BASE_URL, TIMEOUT);
  loginPage = PageFactory.createPage('login', driver, BASE_URL, TIMEOUT);
});

afterAll(async () => {
  if (driver) {
    await driver.quit();
  }
});

describe('Test Suite: Login Functionality of Harmony Church', () => {
  test('TC-001: Valid credentials should login successfully', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();

    const dashboardElement = await driver.wait(
      until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)),
      TIMEOUT
    );
    const actualResult = await dashboardElement.getText();
    const expectedResult = /dashboard/i;

    expect(actualResult).toMatch(expectedResult);
  });

  test('TC-002: Invalid credentials (valid username, invalid password) should display error message', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(INVALID_PASSWORD);
    await loginPage.clickSubmit();

    const modalText = await loginPage.getModalMessageText();
    const expectedText = 'Invalid credentials.';

    expect(modalText).toBe(expectedText);
  });

  test('TC-003: Invalid credentials (invalid username, valid password) should display error message', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();
    await loginPage.enterUsername(INVALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();

    const modalText = await loginPage.getModalMessageText();
    const expectedText = 'Invalid credentials.';

    expect(modalText).toBe(expectedText);
  });

  test('TC-004: Invalid credentials (invalid username, invalid password) should display error message', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();
    await loginPage.enterUsername(INVALID_USERNAME);
    await loginPage.enterPassword(INVALID_PASSWORD);
    await loginPage.clickSubmit();

    const modalText = await loginPage.getModalMessageText();
    const expectedText = 'Invalid credentials.';

    expect(modalText).toBe(expectedText);
  });

  test('TC-005: Login Submit button should be disabled when username is empty', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();
    await loginPage.enterUsername(EMPTY_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);

    const isDisabled = await loginPage.isSubmitButtonDisabled();

    expect(isDisabled).toBe(true);
  });

  test('TC-006: Login Submit button should be disabled when password is empty', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(EMPTY_PASSWORD);

    const isDisabled = await loginPage.isSubmitButtonDisabled();

    expect(isDisabled).toBe(true);
  });

  test('TC-007: Login Submit button should be disabled when username and password are empty', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();
    await loginPage.enterUsername(EMPTY_USERNAME);
    await loginPage.enterPassword(EMPTY_PASSWORD);

    const isDisabled = await loginPage.isSubmitButtonDisabled();

    expect(isDisabled).toBe(true);
  });

  test('TC-008: Clicking Forgot Password link should redirect to recovery page', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();

    const actualUrl = await loginPage.clickLink(RECOVER_PASSWORD_SELECTOR);
    const expectedUrl = `${BASE_URL}/recover-password`;

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-009: Clicking New Account link should redirect to registration page', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();

    const actualUrl = await loginPage.clickLink(NEW_ACCOUNT_SELECTOR);
    const expectedUrl = 'https://login.harmonychurchsuite.com/tenant/user-signup?tenant=qa';

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-010: Tab order should follow expected focus sequence', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();

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
    expect(actualResult).toBe(true);
  });

  test('TC-011: Clicking Contact Us link should redirect to contact page', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();

    const actualUrl = await loginPage.clickLink(CONTACT_US_SELECTOR);
    const expectedUrl = `${BASE_URL}/contact-us`;

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-012: Username field should display error message when is empty', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();

    // Put focus on username
    const usernameField = await driver.findElement(By.css(loginPage.selectors.usernameInput));
    await usernameField.click();

    const result = await loginPage.verifyBlurValidation(
      loginPage.selectors.usernameInput,
      'Username is required'
    );

    expect(result).toBe(true);
  });

  test('TC-013: Password field should display error message when is empty', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();
    await loginPage.enterUsername(VALID_USERNAME);

    const passwordField = await driver.findElement(By.css(loginPage.selectors.passwordInput));
    await passwordField.click(); // Click on the password field to trigger blur event

    const result = await loginPage.verifyBlurValidation(
      loginPage.selectors.passwordInput, // Password field
      'Password must be at least 8 characters' // Expected error message
    );

    expect(result).toBe(true);
  });

  test('TC-014: Username field and Password field should display error messages when both fields are empty', async () => {
    await landingPage.open();
    await landingPage.clickLoginButton();

    // Put focus on username
    const usernameField = await driver.findElement(By.css(loginPage.selectors.usernameInput));
    await usernameField.click();
    await driver.actions().sendKeys(Key.TAB).perform();

    // Put focus on password
    const passwordField = await driver.findElement(By.css(loginPage.selectors.passwordInput));
    await passwordField.click();

    const result = await loginPage.verifyBlurValidation(
      loginPage.selectors.passwordInput,
      'Password must be at least 8 characters'
    );

    expect(result).toBe(true);
  });
});
