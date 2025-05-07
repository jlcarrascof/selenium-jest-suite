const { Builder, By, until } = require('selenium-webdriver');

const TIMEOUT = 120000;
const BASE_URL = 'https://qa.harmonychurchsuite.com/landing';
const VALID_USERNAME = 'javier';
const VALID_PASSWORD = '.qwerty123.';
const INVALID_USERNAME = 'maria';
const INVALID_PASSWORD = '12345';
const CURRENT_BROWSER = 'chrome';

let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser(CURRENT_BROWSER).build();
  await driver.manage().setTimeouts({ implicit: TIMEOUT });
});

afterAll(async () => {
  if (driver) {
    await driver.quit();
  }
});


describe('Test Suite: Login Functionality of Harmony Church', () => {
  async function login(username, password) {

    // Selectors
    const loginBtnSelector = 'a.px-4';
    const inputUsernameSelector = "input[placeholder='Enter your username']";
    const inputPasswordSelector = "input[placeholder='Enter your password']";
    const submitBtnSelector = "button[type='submit']";

    await driver.get(BASE_URL);

    const loginBtn = await driver.wait(until.elementLocated(By.css(loginBtnSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(loginBtn), TIMEOUT);
    await loginBtn.click();

    await driver.findElement(By.css(inputUsernameSelector)).sendKeys(username);
    await driver.findElement(By.css(inputPasswordSelector)).sendKeys(password);

    const submitLoginBtn = await driver.wait(until.elementLocated(By.css(submitBtnSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(submitLoginBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(submitLoginBtn), TIMEOUT);
    await submitLoginBtn.click();
  }

  async function loginWithInvalidCredentials(username, password) {
    await login(username, password);

    // Selectors
    const modalMessageSelector = 'div.mb-8.text-md > p';

    // Step 1:
    const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials.';
    const modalMessage = await driver.wait(until.elementLocated(By.css(modalMessageSelector)), TIMEOUT);
    const modalMessageText = await modalMessage.getText();

    const actualResult = modalMessageText === INVALID_CREDENTIALS_MESSAGE;
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);

  }

  test('TC-001: Valid credentials should login successfully', async () => {

    await login(VALID_USERNAME, VALID_PASSWORD);

    // Selectors
    const dashboardTitleSelector = 'h1.text-xl.font-semibold';

    const dashboardTitle = await driver.wait(
      until.elementLocated(By.css(dashboardTitleSelector)), TIMEOUT
    );

    const actualResult = await dashboardTitle.getText();
    const expectedResult = /dashboard/i;

    expect(actualResult).toMatch(expectedResult);
  });

  test('TC-002: Invalid credentials (valid username, invalid password)  should display error message', async () => {
    await loginWithInvalidCredentials(VALID_USERNAME, INVALID_PASSWORD);
  });

  test('TC-003: Invalid credentials (invalid username, valid password)  should display error message', async () => {
    await loginWithInvalidCredentials(INVALID_USERNAME, VALID_PASSWORD);
  });

  test('TC-004: Invalid credentials (invalid username, invalid password)', async () => {
    await loginWithInvalidCredentials(INVALID_USERNAME, INVALID_PASSWORD);
  });
});
