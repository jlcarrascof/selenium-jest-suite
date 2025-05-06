const { Builder, By, until } = require('selenium-webdriver');

const loginButtonSelector = 'a.px-4';
const inputUsernameSelector = "input[placeholder='Enter your username']";
const inputPasswordSelector = "input[placeholder='Enter your password']";
const submitButtonSelector = "button[type='submit']";
const modalMessageSelector = "div.mb-8.text-md > p";
const TIMEOUT = 120000;

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

    test('TC-003: Validaciones tras login fallido', async () => {
        const errors = [];

        try {
            await driver.get('https://qa.harmonychurchsuite.com/landing');

            // Paso 1 - Hacer clic en Login
            const loginBtn = await driver.findElement(By.css(loginButtonSelector));
            await loginBtn.click();

            // Esperar a que aparezcan los inputs
            await driver.wait(until.elementLocated(By.css(inputUsernameSelector)), 5000);
            await driver.wait(until.elementLocated(By.css(inputPasswordSelector)), 5000);

            const usernameInput = await driver.findElement(By.css(inputUsernameSelector));
            const passwordInput = await driver.findElement(By.css(inputPasswordSelector));

            await usernameInput.sendKeys('javier');
            await passwordInput.sendKeys('.123.');
            await driver.findElement(By.css(submitButtonSelector)).click();

            // Esperar mensaje del modal
            await driver.wait(until.elementLocated(By.css(modalMessageSelector)), 5000);

            const modalMessage = await driver.findElement(By.css(modalMessageSelector));
            const text = await modalMessage.getText();

            if (text.includes('Invalid credentials')) {
                console.log('[chrome] Paso 1 - Modal "Invalid credentials": PASSED');
            } else {
                console.log('[chrome] Paso 1 - Modal "Invalid credentials": FAILED');
                errors.push('No apareció el mensaje "Invalid credentials"');
            }

            await driver.sleep(1500); // Dar tiempo a cualquier limpieza visual

            // Paso 2 - Validar limpieza de campos
            const usernameValue = await usernameInput.getAttribute('value');
            const passwordValue = await passwordInput.getAttribute('value');

            if (usernameValue === '' && passwordValue === '') {
                console.log('[chrome] Paso 2 - Limpieza de campos: PASSED');
            } else {
                console.log('[chrome] Paso 2 - Limpieza de campos: FAILED');
                errors.push('Los campos no fueron limpiados tras el error.');
            }

            // Paso 3 - Verificar foco en campo username
            const activeElement = await driver.executeScript("return document.activeElement.getAttribute('placeholder')");
            if (activeElement === 'Enter your username') {
                console.log('[chrome] Paso 3 - Foco en username: PASSED');
            } else {
                console.log('[chrome] Paso 3 - Foco en username: FAILED');
                errors.push('El foco no volvió al campo username.');
            }

            // Paso 4 - Validar que el error visual desapareció
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
                errors.push('El mensaje de error sigue siendo visible.');
            }

        } catch (err) {
            errors.push('Excepción durante la ejecución: ' + err.message);
        }

        if (errors.length > 0) {
            throw new Error('Errores encontrados:\n' + errors.join('\n'));
        }
    }, TIMEOUT);
});
