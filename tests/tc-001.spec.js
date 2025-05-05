const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');

describe('TC-001: Login Functionality', function () {
  this.timeout(60000); // hasta 60 segundos por test

  let driver;

  before(async () => {
    console.log('Iniciando WebDriver...');
    const options = new chrome.Options().addArguments('--headless');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  after(async () => {
    console.log('Cerrando WebDriver...');
    await driver.quit();
  });

  it('should login successfully to Harmony Church Suite', async () => {
    await driver.get('https://qa.harmonychurchsuite.com/landing');

    const loginLink = await driver.wait(until.elementLocated(By.css('a.px-4')), 10000);
    await loginLink.click();

    await driver.findElement(By.css("input[placeholder='Enter your username']")).sendKeys('javier');
    await driver.findElement(By.css("input[placeholder='Enter your password']")).sendKeys('.qwerty123.');
    await driver.findElement(By.css("button[type='submit']")).click();

    const dashboardTitle = await driver.wait(until.elementLocated(By.css('h1.text-xl.font-semibold')), 10000);
    const text = await dashboardTitle.getText();

    expect(text).to.contain(''); // puedes ajustar según el texto esperado del dashboard
  });
});
