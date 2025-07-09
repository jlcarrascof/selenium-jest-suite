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
/*
  test('TC-001: Valid credentials should login successfully', async () => {

    await loginPage.login(CONFIG.VALID_USERNAME, CONFIG.VALID_PASSWORD);

    const actualResult = await loginPage.getDashboardTitle();
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

      await loginPage.login(username, password);

      const actualResult = await loginPage.getModalText();
      const expectedResult = invalidCredentials;

      expect(actualResult).toBe(expectedResult);
    }, CONFIG.TIMEOUT);
  });


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
*/

  test('TC-009: Username field should display error message when is empty', async () => {

    await loginPage.focusOnUsernameField();

    const actualResult = await loginPage.hasUsernameError();
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);
/*
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
*/
/*
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
      const expectedResult = true;

      expect(actualResult).toBe(expectedResult);
    }, CONFIG.TIMEOUT);
  });
*/
});
