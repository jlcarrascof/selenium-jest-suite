/*
const { Builder, By, until } = require('selenium-webdriver');

const inputUsernameSelector = "input[placeholder='Enter your username']";
const submitButtonSelector = "button[type='submit']";
const TIMEOUT = 120000;

describe('TC-006: Validación visual del campo username no vacío', () => {
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

    test('TC-006: No mostrar errores al ingresar un username válido', async () => {
        const errors = [];

        try {
            await driver.get('https://qa.harmonychurchsuite.com/landing');
            await driver.findElement(By.css('a.px-4')).click();

            await driver.wait(until.elementLocated(By.css(inputUsernameSelector)), 10000);
            const usernameInput = await driver.findElement(By.css(inputUsernameSelector));

            // Ingresar un username válido
            await usernameInput.sendKeys('javier'); // Username válido
            await driver.sleep(500); // Pausa para renderizar

            // Validación 1: El placeholder ya no debe estar visible (porque hay texto)
            const placeholderAttr = await usernameInput.getAttribute('placeholder');
            const valueAttr = await usernameInput.getAttribute('value');
            if (valueAttr && placeholderAttr === 'Enter your username') {
                console.log('[chrome] Placeholder oculto tras texto: PASSED');
            } else {
                errors.push('El placeholder aún es visible o el valor no se ingresó');
            }

            // Validación 2: No debe haber mensaje de validación
            const usernameErrors = await driver.findElements(By.xpath("//*[text()='Username is required']"));
            if (usernameErrors.length === 0) {
                console.log('[chrome] Sin mensaje de error: PASSED');
            } else {
                errors.push('Se muestra un mensaje de error innecesario');
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
