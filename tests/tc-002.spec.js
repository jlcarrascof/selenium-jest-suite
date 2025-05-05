// tc-002.test.js
const { Builder, By, until } = require('selenium-webdriver');

const loginButtonSelector = 'a.px-4';
const inputUsernameSelector = "input[placeholder='Enter your username']";
const inputPasswordSelector = "input[placeholder='Enter your password']";
const submitButton = "button[type='submit']";
const modalMessageSelector = "div.mb-8.text-md > p";
const TIMEOUT = 60000;

describe('TC-002: Invalid Login Message Displayed', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        console.log('Iniciando WebDriver...');
    }, TIMEOUT);

    afterAll(async () => {
        if (driver) {
            await driver.quit();
            console.log('Cerrando WebDriver...');
        }
    });

    test('should display error message for invalid login', async () => {
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

        if (messageText.includes('Invalid credentials')) {
            console.log('[chrome] : Test PASSED - Invalid credentials modal appeared');
        } else {
            console.log('[chrome] : Test FAILED - Expected error message not found');
            throw new Error('Expected "Invalid credentials" message not found.');
        }
    }, 30000); // Timeout por prueba individual
});
