const { Builder, By, until } = require('selenium-webdriver');

const TIMEOUT = 120000;
let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().setTimeouts({ implicit: TIMEOUT });
});

afterAll(async () => {
  if (driver) {
    await driver.quit();
  }
});

describe('Test Suite: Login Functionality of Harmony Church', () => {
  test('TC-001: Valid credentials should login successfully', async () => {
    await driver.get('https://qa.harmonychurchsuite.com/landing');

    const loginBtn = await driver.wait(until.elementLocated(By.css('a.px-4')), TIMEOUT);
    await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
    await loginBtn.click();

    await driver.wait(until.elementLocated(By.css('h1.mb-2')), TIMEOUT);
    await driver.findElement(By.css("input[placeholder='Enter your username']")).sendKeys('javier');
    await driver.findElement(By.css("input[placeholder='Enter your password']")).sendKeys('.qwerty123.');

    const submitBtn = await driver.findElement(By.css("button[type='submit']"));
    await driver.wait(until.elementIsVisible(submitBtn), TIMEOUT);
    await submitBtn.click();

    const dashboardTitle = await driver.wait(
      until.elementLocated(By.css('h1.text-xl.font-semibold')), TIMEOUT
    );

    let actualResult = await dashboardTitle.getText();
    expect(actualResult).toMatch(/dashboard/i);
  });

  test('TC-002: Invalid credentials should display error message', async () => {
    const loginButtonSelector = 'a.px-4';
    const inputUsernameSelector = "input[placeholder='Enter your username']";
    const inputPasswordSelector = "input[placeholder='Enter your password']";
    const submitButton = "button[type='submit']";
    const modalMessageSelector = "div.mb-8.text-md > p";

    await driver.get('https://qa.harmonychurchsuite.com/landing');

    const loginBtn = await driver.wait(until.elementLocated(By.css(loginButtonSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(loginBtn), TIMEOUT);
    await loginBtn.click();

    await driver.wait(until.elementLocated(By.css('h1.mb-2')), TIMEOUT);
    await driver.findElement(By.css(inputUsernameSelector)).sendKeys('maria');
    await driver.findElement(By.css(inputPasswordSelector)).sendKeys('.qwerty123.');

    const submitBtn = await driver.wait(until.elementLocated(By.css(submitButton)), TIMEOUT);
    await driver.wait(until.elementIsVisible(submitBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(submitBtn), TIMEOUT);
    await submitBtn.click();

    const modalMessage = await driver.wait(until.elementLocated(By.css(modalMessageSelector)), TIMEOUT);
    const messageText = await modalMessage.getText();

    let actualResult  = messageText.includes('Invalid credentials.');
    expect(actualResult).toBe(true);
    });

  test('TC-003: Failed login with incorrect password should trigger  validations', async () => {
      const errorMessages = [];
      const loginButtonSelector = 'a.px-4';
      const inputUsernameSelector = "input[placeholder='Enter your username']";
      const inputPasswordSelector = "input[placeholder='Enter your password']";
      const submitButtonSelector = "button[type='submit']";
      const modalMessageSelector = "div.mb-8.text-md > p";

      await driver.get('https://qa.harmonychurchsuite.com/landing');

      const loginBtn = await driver.wait(until.elementLocated(By.css(loginButtonSelector)), TIMEOUT);
      await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
      await loginBtn.click();

      const usernameInput = await driver.wait(until.elementLocated(By.css(inputUsernameSelector)), TIMEOUT);
      const passwordInput = await driver.wait(until.elementLocated(By.css(inputPasswordSelector)), TIMEOUT);

      await usernameInput.sendKeys('javier');
      await passwordInput.sendKeys('12345');

      const submitBtn = await driver.wait(until.elementLocated(By.css(submitButtonSelector)), TIMEOUT);
      await submitBtn.click();

      // Step 1 - Verify modal error message
      const modalMessage = await driver.wait(until.elementLocated(By.css(modalMessageSelector)), TIMEOUT);
      const messageText = await modalMessage.getText();

      console.log('DEBUG: Modal text is ->', messageText);

      const actualResult1 = messageText.includes('Invalid credentials.');
      expect(actualResult1).toBe(true);

      if (!actualResult1) errorMessages.push('Step 1: Modal message not displayed correctly.');

      // Wait briefly to allow UI updates
      await driver.sleep(1500);

      // Step 2 - Check if username and password fields are cleared
      const usernameValue = await usernameInput.getAttribute('value');
      const passwordValue = await passwordInput.getAttribute('value');

      const actualResult2 = usernameValue === '' && passwordValue === '';
      expect(actualResult2).toBe(true);

      if (!actualResult2) errorMessages.push('Step 2: Fields were not cleared.');

      // Step 3 - Check if focus is on username input
      const focusedPlaceholder = await driver.executeScript("return document.activeElement.getAttribute('placeholder')");
      const actualResult3 = focusedPlaceholder === 'Enter your username';
      expect(actualResult3).toBe(true);

      if (!actualResult3) errorMessages.push('Step 3: Focus was not returned to the username field.');

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
});
