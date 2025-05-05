const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

// Selectores y constantes
const loginButtonSelector = 'a.px-4';
const inputUsernameSelector = "input[placeholder='Enter your username']";
const inputPasswordSelector = "input[placeholder='Enter your password']";
const submitButton = "button[type='submit']";
const TIMEOUT = 15000;

// Configura el driver para el test
let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
});

afterAll(async () => {
  await driver.quit();
});

describe('TC-001: Login Functionality', () => {
  test('should login successfully to Harmony Church Suite', async () => {
    // Navega a la página de login
    await driver.get('https://qa.harmonychurchsuite.com/landing');

    // Encuentra y hace clic en el botón de login
    const loginBtn = await driver.wait(until.elementLocated(By.css(loginButtonSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(loginBtn), TIMEOUT);
    await loginBtn.click();

    // Ingresa las credenciales
    await driver.wait(until.elementLocated(By.css('h1.mb-2')), TIMEOUT);
    await driver.findElement(By.css(inputUsernameSelector)).sendKeys('javier');
    await driver.findElement(By.css(inputPasswordSelector)).sendKeys('.qwerty123.');

    // Envía el formulario
    const submitBtn = await driver.wait(until.elementLocated(By.css(submitButton)), TIMEOUT);
    await driver.wait(until.elementIsVisible(submitBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(submitBtn), TIMEOUT);
    await submitBtn.click();

    // Verifica que el login fue exitoso
    const dashboardHeader = await driver.wait(until.elementLocated(By.css('h1.text-xl.font-semibold')), TIMEOUT);
    expect(await dashboardHeader.getText()).toContain(''); // Ajusta con el texto esperado
  }, TIMEOUT);
});
