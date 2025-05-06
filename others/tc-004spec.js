// tc-004.test.js
/*
const { Builder, By, until } = require('selenium-webdriver');

const inputUsernameSelector = "input[placeholder='Enter your username']";
const inputPasswordSelector = "input[placeholder='Enter your password']";
const submitButtonSelector = "button[type='submit']";
const usernameErrorSelector = "p.text-sm.text-red-500:nth-of-type(1)";
const passwordErrorSelector = "p.text-sm.text-red-500:nth-of-type(2)";
const TIMEOUT = 120000;

describe('TC-004: Validaciones al intentar login con campos vacíos', () => {
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

    test('TC-004: Validaciones al intentar login con campos vacíos', async () => {
        const errors = [];

        try {
            await driver.get('https://qa.harmonychurchsuite.com/landing');
            await driver.findElement(By.css('a.px-4')).click();

            // Paso 1: Click en botón Login sin llenar campos
            await driver.findElement(By.css(submitButtonSelector)).click();
            await driver.sleep(1500);

            // Validación 1: placeholder username
            const usernamePlaceholder = await driver.findElement(By.css(inputUsernameSelector)).getAttribute('placeholder');
            if (usernamePlaceholder === 'Enter your username') {
                console.log('[chrome] Placeholder username: PASSED');
            } else {
                errors.push('Placeholder username incorrecto');
            }

            // Validación 2: mensaje "Username is required"
            const usernameError = await driver.findElement(By.xpath("//*[text()='Username is required']")).getText();
            if (usernameError === 'Username is required') {
                console.log('[chrome] Mensaje de error username: PASSED');
            } else {
                errors.push('No se muestra "Username is required"');
            }

            // Validación 3: placeholder password
            const passwordPlaceholder = await driver.findElement(By.css(inputPasswordSelector)).getAttribute('placeholder');
            if (passwordPlaceholder === 'Enter your password') {
                console.log('[chrome] Placeholder password: PASSED');
            } else {
                errors.push('Placeholder password incorrecto');
            }

            // Validación 4: mensaje "Password is required"
            const passwordErrorElement = await driver.findElement(By.xpath("//*[text()='Password is required']"));
            if (await passwordErrorElement.isDisplayed()) {
                console.log('[chrome] Mensaje de error password: PASSED');
            } else {
                errors.push('No se muestra "Password is required" (se muestra otro como "at least 8 characters")');
            }

            // Validación 5: botón login deshabilitado
            const isSubmitDisabled = !(await driver.findElement(By.css(submitButtonSelector)).isEnabled());
            if (isSubmitDisabled) {
                console.log('[chrome] Botón Login deshabilitado: PASSED');
            } else {
                errors.push('El botón Login no está deshabilitado');
            }

        } catch (err) {
            errors.push('Excepción durante la ejecución: ' + err.message);
        }

        if (errors.length > 0) {
            throw new Error('Errores encontrados:\n' + errors.join('\n'));
        }
    }, TIMEOUT);
});
*/
