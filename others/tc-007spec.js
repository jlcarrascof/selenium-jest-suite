const { Builder, By, until } = require('selenium-webdriver');

const inputPasswordSelector = "input[placeholder='Enter your password']";
const submitButtonSelector = "button[type='submit']";
const TIMEOUT = 120000;

describe('TC-007: Validación visual del campo password vacío', () => {
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

    test('TC-007: Mostrar mensaje de error si se deja vacío el campo password', async () => {
        const errors = [];

        try {
            await driver.get('https://qa.harmonychurchsuite.com/landing');
            await driver.findElement(By.css('a.px-4')).click();

            await driver.wait(until.elementLocated(By.css(inputPasswordSelector)), 10000);
            const passwordInput = await driver.findElement(By.css(inputPasswordSelector));

            // Foco y blur sin escribir
            await passwordInput.click();
            await driver.sleep(300);
            await passwordInput.sendKeys('\t'); // Simula perder el foco
            await driver.sleep(800); // Espera renderizado del mensaje

            // 1. Placeholder correcto
            const placeholder = await passwordInput.getAttribute('placeholder');
            if (placeholder === 'Enter your password') {
                console.log('[chrome] Placeholder correcto: PASSED');
            } else {
                errors.push('Placeholder incorrecto');
            }

            // 2. Debe decir "Password is required" pero está mal implementado
            const errorMsgElements = await driver.findElements(By.xpath("//*[text()='Password is required']"));
            if (errorMsgElements.length > 0) {
                console.log('[chrome] Mensaje correcto: PASSED');
            } else {
                errors.push('NO se muestra el mensaje "Password is required"');
            }

            // 3. Botón debe estar deshabilitado
            const submitBtn = await driver.findElement(By.css(submitButtonSelector));
            const isEnabled = await submitBtn.isEnabled();
            if (!isEnabled) {
                console.log('[chrome] Botón deshabilitado: PASSED');
            } else {
                errors.push('El botón Login está habilitado cuando no debería');
            }

        } catch (err) {
            errors.push('Excepción durante la ejecución: ' + err.message);
        }

        if (errors.length > 0) {
            throw new Error('Errores encontrados:\n' + errors.join('\n'));
        }
    }, TIMEOUT);
});
