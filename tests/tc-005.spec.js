const { Builder, By, Key, until } = require('selenium-webdriver');

const inputUsernameSelector = "input[placeholder='Enter your username']";
const submitButtonSelector = "button[type='submit']";
const TIMEOUT = 60000;

describe('TC-005: Validación visual del campo username vacío', () => {
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

    test('TC-005: Mostrar error al dejar vacío el campo username y quitar el foco', async () => {
        const errors = [];

        try {
            await driver.get('https://qa.harmonychurchsuite.com/landing');
            await driver.findElement(By.css('a.px-4')).click();

            // Esperar hasta que el campo username esté presente
            await driver.wait(until.elementLocated(By.css(inputUsernameSelector)), 10000);
            const usernameInput = await driver.findElement(By.css(inputUsernameSelector));

            // Paso 1: Foco en username
            await usernameInput.click();

            // Paso 2: Quitar el foco presionando TAB
            await usernameInput.sendKeys(Key.TAB);
            await driver.sleep(1000);

            // Validación 1: placeholder
            const usernamePlaceholder = await usernameInput.getAttribute('placeholder');
            if (usernamePlaceholder === 'Enter your username') {
                console.log('[chrome] Placeholder username: PASSED');
            } else {
                errors.push('Placeholder username incorrecto');
            }

            // Validación 2: mensaje de validación "Username is required"
            try {
                const usernameError = await driver.findElement(By.xpath("//*[text()='Username is required']"));
                if (await usernameError.isDisplayed()) {
                    console.log('[chrome] Mensaje de error username: PASSED');
                } else {
                    errors.push('No se muestra "Username is required"');
                }
            } catch {
                errors.push('"Username is required" no fue encontrado');
            }

            // Validación 3: botón login deshabilitado
            const submitButton = await driver.findElement(By.css(submitButtonSelector));
            const isDisabled = !(await submitButton.isEnabled());
            if (isDisabled) {
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
