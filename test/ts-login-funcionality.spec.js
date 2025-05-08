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

    let actualResult  = messageText.includes('Invalid credentials');
    expect(actualResult).toBe(true);
    });
});
