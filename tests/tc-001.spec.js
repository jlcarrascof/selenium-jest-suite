// tests/tc-001.spec.js
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { expect } from 'chai';

const testTimeout = 60000; // 60 segundos
let driver;

describe('TC-001: Login Functionality', function () {
  this.timeout(testTimeout); // <- importante

  before(async function () {
    this.timeout(60000);
    console.log('Iniciando WebDriver...');

    const options = new chrome.Options();
    options.setChromeBinaryPath("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"); // <- Ruta explícita
    options.addArguments('--headless', '--disable-gpu', '--no-sandbox');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.get('https://harmonychurchsuite.com/login');
  });

  after(async () => {
    console.log('Cerrando WebDriver...');
    if (driver) await driver.quit();
  });

  it('should login successfully to Harmony Church Suite', async () => {
    const emailInput = await driver.findElement(By.name('email'));
    await emailInput.sendKeys('fake@example.com');

    const passwordInput = await driver.findElement(By.name('password'));
    await passwordInput.sendKeys('fakepassword');

    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();

    await driver.wait(until.urlContains('dashboard'), 10000);
    const currentUrl = await driver.getCurrentUrl();

    expect(currentUrl).to.include('dashboard');
  });
});
