const { Builder, By, until } = require('selenium-webdriver');

const inputPasswordSelector = "input[placeholder='Enter your password']";
const inputUsernameSelector = "input[placeholder='Enter your username']";
const submitButtonSelector = "button[type='submit']";
const TIMEOUT = 120000;

describe('TC-008: Validación visual del campo password NO vacío', () => {
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

    test('TC-008: Ingresar password válido y verificar comportamiento visual', async () => {
        const errors = [];

        try {
            await driver.get('https://qa.harmonychurchsuite.com/landing');
            await driver.findElement(By.css('a.px-4')).click();

            await driver.wait(until.elementLocated(By.css(inputUsernameSelector)), 10000);
            await driver.findElement(By.css(inputUsernameSelector)).sendKeys('javier'); // Username válido

            const passwordInput = await driver.findElement(By.css(inputPasswordSelector));
            await passwordInput.sendKeys('.qwerty.'); // Password válido
            await driver.sleep(1000); // Esperamos renderizado

            // 1. Placeholder debería seguir presente pero no visible (comportamiento del navegador)
            const placeholder = await passwordInput.getAttribute('placeholder');
            if (placeholder === 'Enter your password') {
                console.log('[chrome] Placeholder correcto (oculto al escribir): PASSED');
            } else {
                errors.push('Placeholder incorrecto');
            }

            // 2. No debe aparecer mensaje de validación
            const errorElements = await driver.findElements(By.xpath("//*[contains(text(),'Password is required')]"));
            if (errorElements.length === 0) {
                console.log('[chrome] Sin mensaje de validación: PASSED');
            } else {
                errors.push('Mensaje de validación visible cuando no debería');
            }

            // 3. Verificar que la máscara esté funcionando (tipo password)
            const inputType = await passwordInput.getAttribute('type');
            if (inputType === 'password') {
                console.log('[chrome] Campo enmascarado correctamente: PASSED');
            } else {
                errors.push('El campo password no está enmascarado');
            }

        } catch (err) {
            errors.push('Excepción durante la ejecución: ' + err.message);
        }

        if (errors.length > 0) {
            throw new Error('Errores encontrados:\n' + errors.join('\n'));
        }
    }, TIMEOUT);
});
