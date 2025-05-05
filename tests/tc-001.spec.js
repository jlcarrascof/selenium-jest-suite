const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');
const chrome = require('selenium-webdriver/chrome');

// Selectores y constantes
const loginButtonSelector = 'a.px-4';
const inputUsernameSelector = "input[placeholder='Enter your username']";
const inputPasswordSelector = "input[placeholder='Enter your password']";
const submitButton = "button[type='submit']";
const TIMEOUT = 15000;

// Configura el driver para el test
let driver;

beforeAll(async () => {
    console.log('Iniciando WebDriver...');
    try {
      const options = new chrome.Options();
      options.addArguments('--headless'); // Importante: sin GUI
      options.addArguments('--no-sandbox'); // Previene errores en entornos CI o Linux limitados
      options.addArguments('--disable-dev-shm-usage'); // Mejora manejo de memoria compartida

      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

      console.log('WebDriver iniciado');
    } catch (err) {
      console.error('Error iniciando WebDriver:', err);
      throw err;
    }
}, 90000); // 90 segundos sigue bien para pruebas lentas

afterAll(async () => {
  if (driver) {
    try {
      await driver.quit();
      console.log('WebDriver cerrado');
    } catch (err) {
      console.error('Error cerrando WebDriver:', err);
    }
  }
}, 10000);

describe('TC-001: Login Functionality', () => {
  test('should login successfully to Harmony Church Suite', async () => {
    console.log('Iniciando test de login...');
    await driver.get('https://qa.harmonychurchsuite.com/landing');

    const loginBtn = await driver.wait(until.elementLocated(By.css(loginButtonSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(loginBtn), TIMEOUT);
    await loginBtn.click();

    await driver.wait(until.elementLocated(By.css('h1.mb-2')), TIMEOUT);
    await driver.findElement(By.css(inputUsernameSelector)).sendKeys('javier');
    await driver.findElement(By.css(inputPasswordSelector)).sendKeys('.qwerty123.');

    const submitBtn = await driver.wait(until.elementLocated(By.css(submitButton)), TIMEOUT);
    await driver.wait(until.elementIsVisible(submitBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(submitBtn), TIMEOUT);
    await submitBtn.click();

    const dashboardHeader = await driver.wait(until.elementLocated(By.css('h1.text-xl.font-semibold')), TIMEOUT);
    expect(await dashboardHeader.getText()).toContain(''); // Ajusta con el texto esperado
    console.log('Test de login completado');
  }, TIMEOUT);
});
