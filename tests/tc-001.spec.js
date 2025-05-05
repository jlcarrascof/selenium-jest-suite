const { Builder, By, until } = require('selenium-webdriver');

const TIMEOUT = 60000;
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

describe('TC-001: Login Functionality', () => {
  test('should login successfully to Harmony Church Suite', async () => {
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

    expect(await dashboardTitle.getText()).toMatch(/dashboard/i);
  });
});
