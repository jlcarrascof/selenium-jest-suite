const { Builder, By, until } = require('selenium-webdriver');

const TIMEOUT = 120000;
const TIMESLEEP = 15000;
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

    const loginButtonSelector = 'a.px-4';
    const inputUsernameSelector = "input[placeholder='Enter your username']";
    const inputPasswordSelector = "input[placeholder='Enter your password']";
    const submitButton = "button[type='submit']";
    const modalMessageSelector = 'div.mb-8.text-md > p';

    await driver.get(BASE_URL);

    const loginBtn = await driver.wait(until.elementLocated(By.css(loginButtonSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(loginBtn), TIMEOUT);
    await loginBtn.click();

    await driver.wait(until.elementLocated(By.css('h1.mb-2')), TIMEOUT);
    await driver.findElement(By.css(inputUsernameSelector)).sendKeys(username);
    await driver.findElement(By.css(inputPasswordSelector)).sendKeys(password);

    const submitLoginBtn = await driver.wait(until.elementLocated(By.css(submitButton)), TIMEOUT);
    await driver.wait(until.elementIsVisible(submitBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(submitBtn), TIMEOUT);
    await submitLoginBtn.click();
  }

  test('TC-001: Valid credentials should login successfully', async () => {

    await login(VALID_USERNAME, VALID_PASSWORD);
    const dashboardTitle = await driver.wait(
      until.elementLocated(By.css('h1.text-xl.font-semibold')), TIMEOUT
    );

    const actualResult = await dashboardTitle.getText();
    const expectedResult = /dashboard/i;

    expect(actualResult).toMatch(expectedResult);
  });

  test('TC-002: Invalid credentials should display error message', async () => {

    await login(INVALID_USERNAME, VALID_PASSWORD);

    const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials.';
    const modalMessage = await driver.wait(until.elementLocated(By.css(modalMessageSelector)), TIMEOUT);

    const modalMessageText = await modalMessage.getText();

    const actualResult  = modalMessageText === INVALID_CREDENTIALS_MESSAGE;
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
    });

  test('TC-003: Failed login with incorrect password should trigger  validations', async () => {
      const loginButtonSelector = 'a.px-4';
      const inputUsernameSelector = "input[placeholder='Enter your username']";
      const inputPasswordSelector = "input[placeholder='Enter your password']";
      const submitButtonSelector = "button[type='submit']";
      const modalMessageSelector = 'div.mb-8.text-md > p';

      await driver.get(BASE_URL);

      const loginBtn = await driver.wait(until.elementLocated(By.css(loginButtonSelector)), TIMEOUT);
      await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
      await loginBtn.click();

      const usernameInput = await driver.wait(until.elementLocated(By.css(inputUsernameSelector)), TIMEOUT);
      const passwordInput = await driver.wait(until.elementLocated(By.css(inputPasswordSelector)), TIMEOUT);

      await usernameInput.sendKeys(VALID_USERNAME);
      await passwordInput.sendKeys(INVALID_PASSWORD);

      const submitBtn = await driver.wait(until.elementLocated(By.css(submitButtonSelector)), TIMEOUT);
      await submitBtn.click();

      // Step 1 - Verify modal error message
      const modalMessage = await driver.wait(until.elementLocated(By.css(modalMessageSelector)), TIMEOUT);
      const messageText = await modalMessage.getText();

      const actualResult1 = messageText.includes('Invalid credentials.');
      expect(actualResult1).toBe(true);

      // if (!actualResult1) errorMessages.push('Step 1: Modal message not displayed correctly.');

      // Wait briefly to allow UI updates
      await driver.sleep(TIMESLEEP);

      // Step 2 - Check if username and password fields are cleared
      const usernameValue = await usernameInput.getAttribute('value');
      const passwordValue = await passwordInput.getAttribute('value');

      const actualResult2 = usernameValue === '' && passwordValue === '';
      expect(actualResult2).toBe(true);

      // if (!actualResult2) errorMessages.push('Step 2: Fields were not cleared.');

      // Step 3 - Check if focus is on username input
      const focusedPlaceholder = await driver.executeScript("return document.activeElement.getAttribute('placeholder')");
      const actualResult3 = focusedPlaceholder === 'Enter your username';
      expect(actualResult3).toBe(true);

      // if (!actualResult3) errorMessages.push('Step 3: Focus was not returned to the username field.');

      // Step 4 - Ensure no visible error messages remain
      const errorElements = await driver.findElements(By.xpath("//p[contains(text(),'Invalid credentials')]"));

      let anyErrorVisible = false;

      for (const element of errorElements) {
        if (await element.isDisplayed()) {
          anyErrorVisible = true;
          break;
        }
      }

      const actualResult4 = !anyErrorVisible;
      expect(actualResult4).toBe(true);

      if (!actualResult4) errorMessages.push('Step 4: Error message is still visible.');

      // Fail the test if any step fails
      if (errorMessages.length > 0) {
        throw new Error('TC-003 failed:\n' + errorMessages.join('\n'));
      }
  }, TIMEOUT);

  test('TC-004: Login with empty fields should show validation messages and disable login button', async () => {
    const errorMessages = [];

    // Constants
    const loginButtonSelector = 'a.px-4';
    const inputUsernameSelector = "input[placeholder='Enter your username']";
    const inputPasswordSelector = "input[placeholder='Enter your password']";
    const submitButtonSelector = "button[type='submit']";
    const usernameErrorSelector = "//p[contains(text(),'Username is required')]";
    const passwordErrorSelector = "//p[contains(text(),'Password is required')]";

    await driver.get('https://qa.harmonychurchsuite.com/landing');

    const loginBtn = await driver.wait(until.elementLocated(By.css(loginButtonSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
    await loginBtn.click();

    const usernameInput = await driver.wait(until.elementLocated(By.css(inputUsernameSelector)), TIMEOUT);
    const passwordInput = await driver.wait(until.elementLocated(By.css(inputPasswordSelector)), TIMEOUT);

    // Step 1 - Validate placeholders
    const usernamePlaceholder = await usernameInput.getAttribute('placeholder');
    const passwordPlaceholder = await passwordInput.getAttribute('placeholder');

    const actualResult1 = usernamePlaceholder === 'Enter your username';
    expect(actualResult1).toBe(true);
    if (!actualResult1) errorMessages.push('Step 1: Username placeholder is incorrect.');

    const actualResult2 = passwordPlaceholder === 'Enter your password';
    expect(actualResult2).toBe(true);
    if (!actualResult2) errorMessages.push('Step 1: Password placeholder is incorrect.');

    // Step 2 - Simulate tabbing between fields to leave them empty
    await usernameInput.sendKeys(Key.TAB);  // Simula tab hacia el siguiente campo (Password)
    await passwordInput.sendKeys(Key.TAB);  // Simula tab hacia el siguiente campo (si hubiera)
    await driver.sleep(TIMESLEEP);  // Pausa para asegurar el cambio de foco

    // Step 3 - Try clicking the login button without filling fields
    const submitBtn = await driver.findElement(By.css(submitButtonSelector));
    await submitBtn.click();

    // Step 4 - Validate error messages for empty fields
    const usernameError = await driver.wait(until.elementLocated(By.xpath(usernameErrorSelector)), TIMEOUT);
    const passwordError = await driver.wait(until.elementLocated(By.xpath(passwordErrorSelector)), TIMEOUT);

    const usernameErrorText = await usernameError.getText();
    const passwordErrorText = await passwordError.getText();

    const actualResult3 = usernameErrorText.includes('Username is required');
    expect(actualResult3).toBe(true);
    if (!actualResult3) errorMessages.push('Step 3: Username validation message is incorrect or missing.');

    const actualResult4 = passwordErrorText.includes('Password is required');
    expect(actualResult4).toBe(true);
    if (!actualResult4) errorMessages.push('Step 3: Password validation message is incorrect or missing.');

    // Step 5 - Validate if login button is disabled
    const isSubmitBtnEnabled = await submitBtn.isEnabled();
    const actualResult5 = isSubmitBtnEnabled === false;
    expect(actualResult5).toBe(true);
    if (!actualResult5) errorMessages.push('Step 4: Login button is not disabled.');

    // Final assertion if any step fails
    if (errorMessages.length > 0) {
      throw new Error('TC-004 failed:\n' + errorMessages.join('\n'));
    }
  }, TIMEOUT);

});
