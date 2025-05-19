const { Builder, By, until } = require('selenium-webdriver');

class LoginHelper {
  static currentBrowser;
  static timeout;
  static driver;

  static init(browser, timeout) {
      this.currentBrowser = browser;
      this.timeout = timeout;
  }

  static async initDriver() {
      this.driver = await new Builder().forBrowser(this.currentBrowser).build();
      await this.driver.manage().setTimeouts({ implicit: this.timeout });
  }

  static async getDriver() {
      return this.driver;
  }


  static async landingPageLoginBtnClick() {
    // Selectors
    const loginBtnSelector = 'a.px-4';

    await driver.get(BASE_URL);

    const loginBtn = await driver.wait(until.elementLocated(By.css(loginBtnSelector)), TIMEOUT);

    await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(loginBtn), TIMEOUT);

    await loginBtn.click();
  }

  static async enterFieldsUsernameAndPassword(username, password) {
       // Selectors
       const inputUsernameSelector = "input[placeholder='Enter your username']";
       const inputPasswordSelector = "input[placeholder='Enter your password']";

       await driver.findElement(By.css(inputUsernameSelector)).sendKeys(username);
       await driver.findElement(By.css(inputPasswordSelector)).sendKeys(password);
  }

  static async loginBtnClick() {

    // Selectors
    const submitBtnSelector = "button[type='submit']";

    const submitLoginBtn = await driver.wait(until.elementLocated(By.css(submitBtnSelector)), TIMEOUT);

    await driver.wait(until.elementIsVisible(submitLoginBtn), TIMEOUT);
    await driver.wait(until.elementIsEnabled(submitLoginBtn), TIMEOUT);

    await submitLoginBtn.click();
  }

  static async loginWithInvalidCredentials(username, password) {
    // Selectors
    const modalMessageSelector = 'div.mb-8.text-md > p';

    await LoginHelper.enterFieldsUsernameAndPassword(username, password);
    await LoginHelper.loginBtnClick(username, password);

    const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials.';

    const modalMessage = await driver.wait(until.elementLocated(By.css(modalMessageSelector)), TIMEOUT);
    const modalMessageText = await modalMessage.getText();

    const actualResult = modalMessageText === INVALID_CREDENTIALS_MESSAGE;
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);

  }

  static async loginBtnExpectedToBeDisabled(username, password) {

    // Selectors
    const submitLoginBtnSelector = "button[type='submit']";

    await LoginHelper.enterFieldsUsernameAndPassword(username, password);

    const submitLoginBtn = await driver.findElement(By.css(submitLoginBtnSelector));

    const actualResult = await submitLoginBtn.isEnabled();
    const expectedResult = false;

    expect(actualResult).toBe(expectedResult);
  }

  static async forgotPasswordLinkClick() {
    // Selectors
    const forgotPasswordLinkSelector = "a[href='/recover-password']"; // Ajusta el selector según el HTML real
    const recoverPasswordPageSelector = "#recover-password-form"; // Ajusta según el elemento distintivo de la página de recuperación

    // Ir a la pantalla de login
    await driver.get(BASE_URL);
    await driver.wait(until.elementLocated(By.css('input[placeholder="Enter your username"]')), TIMEOUT); // Verifica que la pantalla de login cargó

    // Localizar y hacer clic en el enlace "Forgot Password?"
    const forgotPasswordLink = await driver.wait(until.elementLocated(By.css(forgotPasswordLinkSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(forgotPasswordLink), TIMEOUT);
    await driver.wait(until.elementIsEnabled(forgotPasswordLink), TIMEOUT);
    await forgotPasswordLink.click();

    // Verificar redirección a la página de recuperación
    const recoverPasswordElement = await driver.wait(until.elementLocated(By.css(recoverPasswordPageSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(recoverPasswordElement), TIMEOUT);

    // Devolver la URL actual para validación
    return await driver.getCurrentUrl();
  }

  static async disposeDriver() {
      if (this.driver) {
          await this.driver.quit();
          this.driver = null;
      }
  }
}

const TIMEOUT = 120000;
const BASE_URL = 'https://qa.harmonychurchsuite.com/landing';
const VALID_USERNAME = 'javier';
const VALID_PASSWORD = '.qwerty123.';
const INVALID_USERNAME = 'maria';
const INVALID_PASSWORD = '.12345.qwerty.';
const CURRENT_BROWSER = 'chrome';
const EMPTY_USERNAME = '';
const EMPTY_PASSWORD = '';

let driver;

beforeAll(async () => {
  LoginHelper.init(CURRENT_BROWSER, TIMEOUT);
  await LoginHelper.initDriver()
  driver = await LoginHelper.getDriver();
});

afterAll(async () => {
  LoginHelper.disposeDriver();
});

describe('Test Suite: Login Functionality of Harmony Church', () => {

  test('TC-001: Valid credentials should login successfully', async () => {

    // Selectors
    const dashboardUrlSelector = 'h1.text-xl.font-semibold';

    await LoginHelper.landingPageLoginBtnClick();
    await LoginHelper.enterFieldsUsernameAndPassword(VALID_USERNAME, VALID_PASSWORD);
    await LoginHelper.loginBtnClick(VALID_USERNAME, VALID_PASSWORD);

    const dashboardUrl = await driver.wait(until.elementLocated(By.css(dashboardUrlSelector)), TIMEOUT);

    const actualResult = await dashboardUrl.getText();
    const expectedResult = /dashboard/i

    expect(actualResult).toMatch(expectedResult);
  });

  test('TC-002: Invalid credentials (valid username, invalid password)  should display error message', async () => {
    await LoginHelper.landingPageLoginBtnClick();
    await LoginHelper.loginWithInvalidCredentials(VALID_USERNAME, INVALID_PASSWORD);
  })

  test('TC-003: Invalid credentials (invalid username, valid password)  should display error message', async () => {
    await LoginHelper.landingPageLoginBtnClick();
    await LoginHelper.loginWithInvalidCredentials(INVALID_USERNAME, VALID_PASSWORD);
  });

  test('TC-004: Invalid credentials (invalid username, invalid password)', async () => {
    await LoginHelper.landingPageLoginBtnClick();
    await LoginHelper.loginWithInvalidCredentials(INVALID_USERNAME, INVALID_PASSWORD);
  });

  test('TC-005: Login Submit button should be disabled when username is empty', async () => {
    await LoginHelper.landingPageLoginBtnClick();
    await LoginHelper.loginBtnExpectedToBeDisabled(EMPTY_USERNAME, VALID_PASSWORD);
  });

  test('TC-006: Login Submit button should be disabled when password is empty', async () => {
    await LoginHelper.landingPageLoginBtnClick();
    await LoginHelper.loginBtnExpectedToBeDisabled(VALID_USERNAME, EMPTY_PASSWORD);
  });

  test('TC-007: Login Submit button should be disabled when username and password are empty', async () => {
    await LoginHelper.landingPageLoginBtnClick();
    await LoginHelper.loginBtnExpectedToBeDisabled(EMPTY_USERNAME, EMPTY_PASSWORD);
  });

  test('TC-010: Clicking Forgot Password link should redirect to recovery page', async () => {
    await LoginHelper.landingPageLoginBtnClick();

    const expectedUrl = `${BASE_URL}/recover-password`; // Ajusta según la URL real de la página de recuperación
    const actualUrl = await LoginHelper.forgotPasswordLinkClick();

    expect(actualUrl).toBe(expectedUrl);
  });

  /*

      test('TC-008: Mostrar error al dejar vacío el campo username y quitar el foco', async () => {
          const errors = [];
          const inputUsernameSelector = "input[placeholder='Enter your username']";
          const submitButtonSelector = "button[type='submit']";
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
        });

    test('TC-009: No mostrar errores al ingresar un username válido', async () => {
        const errors = [];
        const inputUsernameSelector = "input[placeholder='Enter your username']";
        const submitButtonSelector = "button[type='submit']";
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
        });

    test('TC-010: Mostrar mensaje de error si se deja vacío el campo password', async () => {
          const errors = [];
          const inputPasswordSelector = "input[placeholder='Enter your password']";
          const submitButtonSelector = "button[type='submit']";
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
        });

 test('TC-011: Ingresar password válido y verificar comportamiento visual', async () => {
        const errors = [];
const inputPasswordSelector = "input[placeholder='Enter your password']";
const inputUsernameSelector = "input[placeholder='Enter your username']";
const submitButtonSelector = "button[type='submit']";
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
        });

         test("TC-010: Redirigir a la página de recuperación de password al hacer click en 'Forgot Password?'", async () => {
        const errors = [];
const forgotPasswordSelector = "a[href*='forgot-password']";
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
  });

  test('TC-012: "New Account" link should redirect to registration form', async () => {
    // Selectors

    const loginBtnSelector = 'a.px-4';
    const newAccountLinkSelector = 'a[href="/user-signup"]';
    const registrationFormFieldSelector = 'input[placeholder="Enter your name"]';

    await driver.get(BASE_URL);

    const loginBtn = await driver.wait(until.elementLocated(By.css(loginBtnSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(loginBtn), TIMEOUT);
    await loginBtn.click();

    // Click in 'New Account'
    const newAccountLink = await driver.wait(until.elementLocated(By.css(newAccountLinkSelector)), TIMEOUT);
    await driver.wait(until.elementIsVisible(newAccountLink), TIMEOUT);
    await newAccountLink.click();

    // Wait for the registration form to load
    const registrationField = await driver.wait(until.elementLocated(By.css(registrationFormFieldSelector)), TIMEOUT);
    expect(await registrationField.isDisplayed()).toBe(true);
  });
*/
});
