/*
const { Builder, By, until } = require('selenium-webdriver');

const forgotPasswordSelector = "a[href*='forgot-password']";
const TIMEOUT = 60000;

describe('TC-010: Funcionalidad Forgot Password', () => {
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

    test("TC-010: Redirigir a la página de recuperación de password al hacer click en 'Forgot Password?'", async () => {
        const errors = [];

        try {
            await driver.get('https://qa.harmonychurchsuite.com/landing');
            await driver.findElement(By.css('a.px-4')).click();

            await driver.wait(until.elementLocated(By.css(forgotPasswordSelector)), 10000);
            const forgotLink = await driver.findElement(By.css(forgotPasswordSelector));
            await forgotLink.click();

            await driver.sleep(3000); // Esperar redirección

            const currentUrl = await driver.getCurrentUrl();
            if (!currentUrl.includes('forgot-password')) {
                errors.push(`No se redirigió correctamente. URL actual: ${currentUrl}`);
            } else {
                console.log('[chrome] Redirección a recuperación de contraseña: PASSED');
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
