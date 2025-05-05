// tc-003.test.js
const { Builder, By, until } = require('selenium-webdriver');

const loginButtonSelector = 'a.px-4';
const inputUsernameSelector = "input[placeholder='Enter your username']";
const inputPasswordSelector = "input[placeholder='Enter your password']";
const submitButtonSelector = "button[type='submit']";
const modalMessageSelector = "div.mb-8.text-md > p";
const TIMEOUT = 60000;

describe('TC-003: Validaciones tras login fallido', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        console.log('WebDriver iniciado...');
    }, TIMEOUT);

    afterAll(async () => {
        if (driver) {
            await driver.quit();
            console.log('WebDriver cerrado...');
        }
    });

    test('debería mostrar errores, limpiar campos y reenfocar username tras login inválido', async () => {
        await driver.get('https://qa.harmonychurchsuite.com/landing');

        const loginBtn = await driver.wait(until.elementLocated(By.css(loginButtonSelector)), TIMEOUT);
        await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
        await driver.wait(until.elementIsEnabled(loginBtn), TIMEOUT);
        await loginBtn.click();

        await driver.wait(until.elementLocated(By.css('h1.mb-2')), TIMEOUT);
        const usernameInput = await driver.findElement(By.css(inputUsernameSelector));
        const passwordInput = await driver.findElement(By.css(inputPasswordSelector));
        await usernameInput.sendKeys('javier');
        await passwordInput.sendKeys('.123.');

        const submitBtn = await driver.wait(until.elementLocated(By.css(submitButtonSelector)), TIMEOUT);
        await driver.wait(until.elementIsVisible(submitBtn), TIMEOUT);
        await driver.wait(until.elementIsEnabled(submitBtn), TIMEOUT);
        await submitBtn.click();

        // Paso 1: Verificar modal de error
        const modalMessage = await driver.wait(until.elementLocated(By.css(modalMessageSelector)), TIMEOUT);
        const messageText = await modalMessage.getText();
        if (messageText.includes('Invalid credentials')) {
            console.log('[chrome] Paso 1 - Modal "Invalid credentials": PASSED');
        } else {
            console.log('[chrome] Paso 1 - Modal "Invalid credentials": FAILED');
            throw new Error('No se encontró el mensaje esperado en el modal.');
        }

        await driver.sleep(1500);

        // Paso 2: Campos vacíos
        const usernameValue = await usernameInput.getAttribute('value');
        const passwordValue = await passwordInput.getAttribute('value');
        if (usernameValue === '' && passwordValue === '') {
            console.log('[chrome] Paso 2 - Limpieza de campos: PASSED');
        } else {
            console.log('[chrome] Paso 2 - Limpieza de campos: FAILED');
            throw new Error('Los campos no fueron limpiados tras el error.');
        }

        // Paso 3: Foco en username
        const activeElementName = await driver.executeScript(
            "return document.activeElement.getAttribute('placeholder')"
        );
        if (activeElementName === 'Enter your username') {
            console.log('[chrome] Paso 3 - Foco en username: PASSED');
        } else {
            console.log('[chrome] Paso 3 - Foco en username: FAILED');
            throw new Error('El foco no volvió al input de username.');
        }

        // Paso 4: No errores visuales persistentes
        const possibleErrors = await driver.findElements(By.xpath("//p[contains(text(),'Invalid credentials')]"));
        let anyVisible = false;
        for (let el of possibleErrors) {
            if (await el.isDisplayed()) {
                anyVisible = true;
                break;
            }
        }
        if (!anyVisible) {
            console.log('[chrome] Paso 4 - No hay errores visuales: PASSED');
        } else {
            console.log('[chrome] Paso 4 - No hay errores visuales: FAILED');
            throw new Error('El mensaje de error sigue visible.');
        }
    }, 30000); // timeout del test individual
});
