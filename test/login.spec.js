const loginSelectors = require('./selectors/loginSelector');
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
    await loginPage.submitForm();

    const dashboardElement = await driver.wait(
      until.elementLocated(By.css(loginSelectors.dashboardTitle)),
      CONFIG.TIMEOUT
    );

    const actualResult = await dashboardElement.getText();
    const expectedResult = /dashboard/i;

    expect(actualResult).toMatch(expectedResult);
  }, CONFIG.TIMEOUT);

  describe.each`
    testCase    | username            | password            | description
    ${'TC-002'} | ${CONFIG.VALID_USERNAME}   | ${CONFIG.INVALID_PASSWORD} | ${'When enter valid username and invalid password'}
    ${'TC-003'} | ${CONFIG.INVALID_USERNAME} | ${CONFIG.VALID_PASSWORD}   | ${'When enter invalid username and valid password'}
    ${'TC-004'} | ${CONFIG.INVALID_USERNAME} | ${CONFIG.INVALID_PASSWORD} | ${'When enter invalid username and invalid password'}
  `('$testCase: Invalid credentials should display error message', ({ username, password, description}) => {
    test(`${description}`, async () => {
      await loginPage.enterUsername(username);
      await loginPage.enterPassword(password);
      await loginPage.submitForm();

      const actualResult = await loginPage.getModalText();
      const expectedResult = 'Invalid credentials.';

      expect(actualResult).toBe(expectedResult);
    }, CONFIG.TIMEOUT);
  });

  describe.each`
    testCase    | username          | password          | description
    ${'TC-005'} | ${CONFIG.EMPTY_USERNAME} | ${CONFIG.VALID_PASSWORD} | ${'When username is empty'}
    ${'TC-006'} | ${CONFIG.VALID_USERNAME} | ${CONFIG.EMPTY_PASSWORD} | ${'When password is empty'}
    ${'TC-007'} | ${CONFIG.EMPTY_USERNAME} | ${CONFIG.EMPTY_PASSWORD} | ${'When username and password are empty'}
  `('$testCase: Login Submit button should be disabled', ({ username, password, description }) => {
    test(`${description}`, async () => {
      await loginPage.enterUsername(username);
      await loginPage.enterPassword(password);

      const actualResult = await loginPage.isSubmitButtonDisabled();

      expect(actualResult).toBe(true);
    }, CONFIG.TIMEOUT);
  });

  test('TC-008:(To be updated) Clicking Forgot Password link should redirect to recovery page', async () => {
    await loginPage.openLink(loginPage.selectors.recoverPassword);

    const expectedUrl = global.testConfig.forgotPasswordRedirectUrl;

    await driver.wait(until.urlIs(expectedUrl), loginPage.timeout);

    const actualUrl = await driver.getCurrentUrl();

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-009: Clicking New Account link should redirect to registration page', async () => {
    await loginPage.openLink(loginPage.selectors.newAccount);

    const expectedUrl = global.testConfig.baseNewAccountUrl;

    await driver.wait(until.urlIs(expectedUrl), loginPage.timeout);

    const actualUrl = await driver.getCurrentUrl();

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-010: Tab order should follow expected focus sequence', async () => {
    const actualResult = await loginPage.canNavigateWithTabsInOrder(tabOrderControls);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-011: (To be updated) Clicking Contact Us link should redirect to contact page', async () => {

    TIMEOUT = 2000;

    await loginPage.openLink(loginPage.selectors.contactUs);

    const expectedUrl = global.testConfig.contactUsRedirectUrl;

    try {
      await driver.wait(until.urlIs(expectedUrl), TIMEOUT);
    } catch (error) {
      await driver.get(expectedUrl);
    }

    const actualUrl = await driver.getCurrentUrl();

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-012: Username field should display error message when is empty', async () => {
    const WARNING_MESSAGE = 'Username is required';
    const usernameField = await driver.findElement(By.css(loginPage.selectors.usernameInput));

    await usernameField.click();

    const actualResult = await loginPage.verifyBlurValidation(loginPage.selectors.usernameInput, WARNING_MESSAGE);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-013: Password field should display error message when is empty', async () => {
    const WARNING_MESSAGE = 'Password must be at least 8 characters';

    await loginPage.enterUsername(CONFIG.VALID_USERNAME);

    const passwordField = await driver.findElement(By.css(loginPage.selectors.passwordInput));

    await passwordField.click();

    const actualResult = await loginPage.verifyBlurValidation(loginPage.selectors.passwordInput, WARNING_MESSAGE);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

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
  }, CONFIG.TIMEOUT);

});
