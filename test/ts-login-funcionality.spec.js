const { Builder, By, until } = require('selenium-webdriver');

const TIMEOUT = 120000;
const BASE_URL = 'https://qa.harmonychurchsuite.com/landing';
const VALID_USERNAME = 'javier';
const VALID_PASSWORD = '.qwerty123.';
const INVALID_USERNAME = 'maria';
const INVALID_PASSWORD = '.12345.qwerty.';
const CURRENT_BROWSER = 'chrome';
const EMPTY_USERNAME = '';
const EMPTY_PASSWORD = '';

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

  async function landingLoginBtnClick() {
    // Selectors
    const loginBtnSelector = 'a.px-4';

    await driver.get(BASE_URL);

    const loginBtn = await driver.wait(until.elementLocated(By.css(loginBtnSelector)), TIMEOUT);

    await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(loginBtn), TIMEOUT);

    await loginBtn.click();

  }

  async function enterFieldsUsernameAndPassword(username, password) {
       // Selectors
       const inputUsernameSelector = "input[placeholder='Enter your username']";
       const inputPasswordSelector = "input[placeholder='Enter your password']";

       await driver.findElement(By.css(inputUsernameSelector)).sendKeys(username);
       await driver.findElement(By.css(inputPasswordSelector)).sendKeys(password);
  }
  async function loginBtnClick() {

    // Selectors
    const submitBtnSelector = "button[type='submit']";

    const submitLoginBtn = await driver.wait(until.elementLocated(By.css(submitBtnSelector)), TIMEOUT);

    await driver.wait(until.elementIsVisible(submitLoginBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(submitLoginBtn), TIMEOUT);

    await submitLoginBtn.click();
  }

  async function loginWithInvalidCredentials(username, password) {
    // Selectors
    const modalMessageSelector = 'div.mb-8.text-md > p';

    await enterFieldsUsernameAndPassword(username, password);
    await loginBtnClick(username, password);

    const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials.';

    const modalMessage = await driver.wait(until.elementLocated(By.css(modalMessageSelector)), TIMEOUT);
    const modalMessageText = await modalMessage.getText();

    const actualResult = modalMessageText === INVALID_CREDENTIALS_MESSAGE;
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);

  }
  async function loginBtnExpectedToBeDisabled({ username, password }) {

    await enterFieldsUsernameAndPassword(username, password);

    const submitBtn = await driver.findElement(By.css(submitBtnSelector));

    const actualResult = await submitBtn.isEnabled();
    const expectedResult = false;

    expect(actualResult).toBe(expectedResult);
  }

  async function loginExpectingEmptyFieldError({ username, password }, expectedErrorText) {

    // Selectors
    const loginBtnSelector = 'a.px-4';
    const inputUsernameSelector = "input[placeholder='Enter your username']";
    const inputPasswordSelector = "input[placeholder='Enter your password']";
    const submitBtnSelector = "button[type='submit']";

    await driver.get(BASE_URL);

    const loginBtn = await driver.wait(until.elementLocated(By.css(loginBtnSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
    await loginBtn.click();

    const usernameInput = await driver.findElement(By.css(inputUsernameSelector));
    const passwordInput = await driver.findElement(By.css(inputPasswordSelector));

    if (username !== '') await usernameInput.sendKeys(username);
    if (password !== '') await passwordInput.sendKeys(password);

    await usernameInput.click();
    await passwordInput.click();

    const submitBtn = await driver.findElement(By.css(submitBtnSelector));
    await submitBtn.click();

    const errorElement = await driver.wait(
      until.elementLocated(By.xpath(`//*[text()='${expectedErrorText}']`)),
      TIMEOUT
    );

    const actualText = (await errorElement.getText()).trim();
    expect(actualText).toBe(expectedErrorText);
  }

  test('TC-001: Valid credentials should login successfully', async () => {

    // Selectors
    const dashboardUrlSelector = 'h1.text-xl.font-semibold';

    await landingLoginBtnClick();
    await enterFieldsUsernameAndPassword(VALID_USERNAME, VALID_PASSWORD);
    await loginBtnClick(VALID_USERNAME, VALID_PASSWORD);

    const dashboardUrl = await driver.wait(
    until.elementLocated(By.css(dashboardUrlSelector)), TIMEOUT
    );

    const actualResult = await dashboardUrl.getText();
    const expectedResult = /dashboard/i

    expect(actualResult).toMatch(expectedResult);
  });

  test('TC-002: Invalid credentials (valid username, invalid password)  should display error message', async () => {
    await landingLoginBtnClick();
    await enterFieldsUsernameAndPassword(VALID_USERNAME, INVALID_PASSWORD);
    await loginWithInvalidCredentials(VALID_USERNAME, INVALID_PASSWORD);
  })


  test('TC-003: Invalid credentials (invalid username, valid password)  should display error message', async () => {
    await landingLoginBtnClick();
    await enterFieldsUsernameAndPassword(INVALID_USERNAME, VALID_PASSWORD);
    await loginWithInvalidCredentials(INVALID_USERNAME, VALID_PASSWORD);
  });

  test('TC-004: Invalid credentials (invalid username, invalid password)', async () => {
    await landingLoginBtnClick();
    await enterFieldsUsernameAndPassword(INVALID_USERNAME, INVALID_PASSWORD);
    await loginWithInvalidCredentials(INVALID_USERNAME, INVALID_PASSWORD);
  });

  test('TC-005: Login Submit button should be disabled when username is empty', async () => {
    await landingLoginBtnClick();
    await enterFieldsUsernameAndPassword(EMPTY_USERNAME, VALID_PASSWORD);

    await loginBtnExpectedToBeDisabled(EMPTY_USERNAME, VALID_PASSWORD );
  });

  /*

  test('TC-006: Should keep submit button disabled when password is empty', async () => {
    await loginExpectingDisabledSubmitBtn({ username: VALID_USERNAME, password: EMPTY_PASSWORD });
  });

  test('TC-007: Submit button should be disabled when both fields are empty', async () => {
    await loginExpectingDisabledSubmitBtn({ username: EMPTY_USERNAME, password: EMPTY_PASSWORD });
  });

  test('TC-011: "New Account" link should redirect to registration form', async () => {
    // Selectors

    const loginBtnSelector = 'a.px-4';
    const newAccountLinkSelector = 'a[href="/user-signup"]';
    const registrationFormFieldSelector = 'input[placeholder="Enter your name"]';

    await driver.get(BASE_URL);

    const loginBtn = await driver.wait(until.elementLocated(By.css(loginBtnSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
    await loginBtn.click();

    // Click in 'New Account'
    const newAccountLink = await driver.wait(until.elementLocated(By.css(newAccountLinkSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(newAccountLink), TIMEOUT);
    await newAccountLink.click();

    // Wait for the registration form to load
    const registrationField = await driver.wait(until.elementLocated(By.css(registrationFormFieldSelector)), TIMEOUT);
    expect(await registrationField.isDisplayed()).toBe(true);
  });
*/
});
