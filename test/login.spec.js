const loginPageSelector = require('./selectors/loginSelector');
const tabOrderControls = require('./selectors/tabOrderControls');
const {
  CONFIG,
  initPages,
  driver: getDriver
} = require('./helpers/loginTestSetup');
const { By, until, Key } = require('selenium-webdriver');

let driver;
let loginPage;
let landingPage;

beforeAll(async () => {
  const pages = await initPages();
  driver = pages.driver;
  loginPage = pages.loginPage;
  landingPage = pages.landingPage;
});

afterAll(async () => {
  if (driver) await driver.quit();
});

beforeEach(async () => {
  await landingPage.open();
  await landingPage.clickLoginButton();
});

describe('Test Suite: Login Functionality of Harmony Church', () => {
  test('TC-001: Valid credentials should login successfully', async () => {

    await loginPage.open();
    await loginPage.enterUsername(CONFIG.VALID_USERNAME);
    await loginPage.enterPassword(CONFIG.VALID_PASSWORD);
    await loginPage.clickLoginButton();

    const actualResult = await loginPage.getDashboardTitle();
    const expectedResult = /dashboard/i;

    expect(actualResult).toMatch(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-002:(To be updated) Clicking Forgot Password link should redirect to recovery page', async () => {
    await loginPage.clickRecoverPasswordLink();

    const expectedUrl = global.testConfig.forgotPasswordRedirectUrl;
    const actualUrl = await loginPage.getCurrentUrl();

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-003: Clicking New Account link should redirect to registration page', async () => {
    await loginPage.clickNewAccountLink();

    const expectedUrl = global.testConfig.baseNewAccountUrl;
    await loginPage.waitForUrl(expectedUrl);

    const actualUrl = await loginPage.getCurrentUrl();

    expect(actualUrl).toBe(expectedUrl);

  }, CONFIG.TIMEOUT);

  test('TC-004: Tab order should follow expected focus sequence', async () => {
    const actualResult = await loginPage.pressTabKeysAndNavigate(tabOrderControls);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-005: (To be updated) Clicking Contact Us link should redirect to contact page', async () => {
      await loginPage.clickContactUsLink();

      const expectedUrl = global.testConfig.contactUsRedirectUrl;
      const timeout = global.testConfig.contactUsRedirectTimeout;

      await loginPage.ensureRedirectTo(expectedUrl, timeout);

      const actualUrl = await loginPage.getCurrentUrl();

      expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-006: Username field should display error message when is empty', async () => {
    const WARNING_MESSAGE = 'Username is required';
    const usernameField = await driver.findElement(By.css(loginPage.selectors.usernameInput));

    await usernameField.click();

    const actualResult = await loginPage.verifyBlurValidation(loginPage.selectors.usernameInput, WARNING_MESSAGE);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

/*
  test('TC-007: Password field should display error message when is empty', async () => {
    const WARNING_MESSAGE = 'Password must be at least 8 characters';

    await loginPage.enterUsername(CONFIG.VALID_USERNAME);

    const passwordField = await driver.findElement(By.css(loginPage.selectors.passwordInput));

    await passwordField.click();

    const actualResult = await loginPage.verifyBlurValidation(loginPage.selectors.passwordInput, WARNING_MESSAGE);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-008: Username field and Password field should display error messages when both fields are empty', async () => {
    const WARNING_MESSAGE = 'Password must be at least 8 characters';
    const usernameField = await driver.findElement(By.css(loginPage.selectors.usernameInput));

    await usernameField.click();
    await driver.actions().sendKeys(Key.TAB).perform();

    const passwordField = await driver.findElement(By.css(loginPage.selectors.passwordInput));

    await passwordField.click();

    const actualResult = await loginPage.verifyBlurValidation(loginPage.selectors.passwordInput, WARNING_MESSAGE);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  describe.each`
    testCase    | username            | password            | description
    ${'TC-009'} | ${CONFIG.VALID_USERNAME}   | ${CONFIG.INVALID_PASSWORD} | ${'When enter valid username and invalid password'}
    ${'TC-010'} | ${CONFIG.INVALID_USERNAME} | ${CONFIG.VALID_PASSWORD}   | ${'When enter invalid username and valid password'}
    ${'TC-011'} | ${CONFIG.INVALID_USERNAME} | ${CONFIG.INVALID_PASSWORD} | ${'When enter invalid username and invalid password'}
  `('$testCase: Invalid credentials should display error message', ({ username, password, description}) => {
    test(`${description}`, async () => {
      await loginPage.enterUsername(username);
      await loginPage.enterPassword(password);
      await loginPage.clickLoginButton();

      const actualResult = await loginPage.getModalText();
      const expectedResult = 'Invalid credentials.';

      expect(actualResult).toBe(expectedResult);
    }, CONFIG.TIMEOUT);
  });

  describe.each`
    testCase    | username          | password          | description
    ${'TC-012'} | ${CONFIG.EMPTY_USERNAME} | ${CONFIG.VALID_PASSWORD} | ${'When username is empty'}
    ${'TC-013'} | ${CONFIG.VALID_USERNAME} | ${CONFIG.EMPTY_PASSWORD} | ${'When password is empty'}
    ${'TC-014'} | ${CONFIG.EMPTY_USERNAME} | ${CONFIG.EMPTY_PASSWORD} | ${'When username and password are empty'}
  `('$testCase: Login Submit button should be disabled', ({ username, password, description }) => {
    test(`${description}`, async () => {
      await loginPage.enterUsername(username);
      await loginPage.enterPassword(password);

      const actualResult = await loginPage.isSubmitButtonDisabled();

      expect(actualResult).toBe(true);
    }, CONFIG.TIMEOUT);
  });
*/
});
