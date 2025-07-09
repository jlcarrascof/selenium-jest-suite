const { invalidCredentials } = require('./lib/testConfig');

const { CONFIG, initPages} = require('./setup/loginTestSetup');

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

    await loginPage.login(CONFIG.VALID_USERNAME, CONFIG.VALID_PASSWORD);

    const actualResult = await loginPage.getDashboardTitle();
    const expectedResult = /dashboard/i;

    expect(actualResult).toMatch(expectedResult);
  }, CONFIG.TIMEOUT);

  test.each([
    ['TC-002', 'When enter valid username and invalid password',   CONFIG.VALID_USERNAME,   CONFIG.INVALID_PASSWORD],
    ['TC-003', 'When enter invalid username and valid password',   CONFIG.INVALID_USERNAME, CONFIG.VALID_PASSWORD],
    ['TC-004', 'When enter invalid username and invalid password', CONFIG.INVALID_USERNAME, CONFIG.INVALID_PASSWORD]
  ])(
    '%s: %s',
    async (_testCase, description, username, password) => {
      await loginPage.open();
      await loginPage.login(username, password);

      const actualResult   = await loginPage.getModalText();
      const expectedResult = invalidCredentials;

      expect(actualResult).toBe(expectedResult);
    }, CONFIG.TIMEOUT
  );

  test('TC-005:(To be updated) Clicking Forgot Password link should redirect to recovery page', async () => {

    await loginPage.clickRecoverPasswordLink();

    const expectedUrl = global.testConfig.forgotPasswordRedirectUrl;

    const timeout = global.testConfig.contactUsRedirectTimeout;

    await loginPage.ensureRedirectTo(expectedUrl, timeout);

    const actualUrl = await loginPage.getCurrentUrl();

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-006: Clicking New Account link should redirect to registration page', async () => {

    await loginPage.clickNewAccountLink();

    const expectedUrl = global.testConfig.baseNewAccountUrl;

    const timeout = global.testConfig.contactUsRedirectTimeout;

    await loginPage.ensureRedirectTo(expectedUrl, timeout);

    const actualUrl = await loginPage.getCurrentUrl();

    expect(actualUrl).toBe(expectedUrl);

  }, CONFIG.TIMEOUT);

  test('TC-007: (To be updated) Clicking Contact Us link should redirect to contact page', async () => {

      await loginPage.clickContactUsLink();

      const expectedUrl = global.testConfig.contactUsRedirectUrl;
      const timeout = global.testConfig.contactUsRedirectTimeout;

      await loginPage.ensureRedirectTo(expectedUrl, timeout);

      const actualUrl = await loginPage.getCurrentUrl();

      expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);


  test('TC-008: Tab order should follow expected focus sequence', async () => {

    const actualResult = await loginPage.canPressTabKeysAndNavigateAll();
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-009: Username field should display error message when is empty', async () => {

    await loginPage.focusOnUsernameField();

    const actualResult = await loginPage.hasUsernameError();
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-010: Password field should display error message when is empty', async () => {

      await loginPage.enterUsername(CONFIG.VALID_USERNAME);
      await loginPage.focusOnPasswordField();

      const actualResult = await loginPage.hasPasswordError();
      const expectedResult = true;

      expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-011: Username field and Password field should display error messages when both fields are empty', async () => {

    await loginPage.focusOnUsernameFieldAndTab();
    await loginPage.focusOnPasswordField();

    const actualResult = await loginPage.hasPasswordError();
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test.each([
    ['TC-012', 'When username is empty',           CONFIG.EMPTY_USERNAME, CONFIG.VALID_PASSWORD],
    ['TC-013', 'When password is empty',           CONFIG.VALID_USERNAME, CONFIG.EMPTY_PASSWORD],
    ['TC-014', 'When username and password are empty', CONFIG.EMPTY_USERNAME, CONFIG.EMPTY_PASSWORD]
  ])(
    '%s: Login Submit button should be disabled - %s',
    async (_testCase, description, username, password) => {
      await loginPage.open();
      await loginPage.enterUsername(username);
      await loginPage.enterPassword(password);

      const actualResult   = await loginPage.isSubmitButtonDisabled();
      const expectedResult = true;

      expect(actualResult).toBe(expectedResult);
    }, CONFIG.TIMEOUT
  );

});
