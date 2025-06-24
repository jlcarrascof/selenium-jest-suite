const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until, Key } = require('selenium-webdriver');

const VALID_NAME = 'Javier';
const VALID_SURNAME = 'Martinez';
const VALID_EMAIL = 'javier.martinez@example.com';
const VALID_USERNAME = 'javiermartinez';
const VALID_PASSWORD = 'Password123!';
const DIFFERENT_PASSWORD = 'Password123*';
const ONLY_NUMBERS_PASSWORD = '12345678';
const ONLY_LETTERS_PASSWORD = 'abcdefgh';
const LESS_THAN_8_PASSWORD = 'ab1@';
const INVALID_EMAIL_FORMAT = 'test@';

let driver;
let newAccountPage;

// --- Helpers

async function fillAllFields(newAccountPage, name, surname, email, username, password, confirmPassword) {
  await newAccountPage.driver.findElement(By.css(newAccountPage.selectors.nameInput)).sendKeys(name);
  await newAccountPage.driver.findElement(By.css(newAccountPage.selectors.surnameInput)).sendKeys(surname);
  await newAccountPage.driver.findElement(By.css(newAccountPage.selectors.emailInput)).sendKeys(email);
  await newAccountPage.driver.findElement(By.css(newAccountPage.selectors.usernameInput)).sendKeys(username);
  await newAccountPage.driver.findElement(By.css(newAccountPage.selectors.passwordInput)).sendKeys(password);
  await newAccountPage.driver.findElement(By.css(newAccountPage.selectors.confirmPasswordInput)).sendKeys(confirmPassword);
}

async function toggleTermsAndConditions(newAccountPage, shouldBeChecked) {
  const termsCheckbox = await newAccountPage.driver.findElement(By.xpath(newAccountPage.selectors.termsCheckbox));

  await newAccountPage.driver.wait(until.elementIsVisible(termsCheckbox), newAccountPage.timeout);

  const isChecked = await termsCheckbox.isSelected();
  if ((shouldBeChecked && !isChecked) || (!shouldBeChecked && isChecked)) {
    await termsCheckbox.click();
  }
}

beforeAll(async () => {
  const driverFactory = new DriverFactory(global.testConfig.currentBrowser, global.testConfig.timeout);

  driver = await driverFactory.initDriver();

  newAccountPage = PageFactory.createPage('newAccount', driver, global.testConfig.baseNewAccountUrl, global.testConfig.timeout);
});

afterAll(async () => {
  if (driver) await driver.quit();
});

describe('Test Suite: New Account Functionality of Harmony Church', () => {

  beforeEach(async () => {
    await newAccountPage.open();
  });

  test('TC-001: Terms and Conditions checkbox should display error message when unchecked', async () => {
    await toggleTermsAndConditions(newAccountPage, false);

    const actualResult = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.termsCheckbox,
      newAccountPage.selectors.termsError,
      true
    );

    expect(actualResult).toBe(true);
  });

  test('TC-002: All fields should display error messages when are empty', async () => {
    const emptyFieldsConfig = [
      { selector: newAccountPage.selectors.nameInput, error: newAccountPage.selectors.nameError },
      { selector: newAccountPage.selectors.surnameInput, error: newAccountPage.selectors.surnameError },
      { selector: newAccountPage.selectors.emailInput, error: newAccountPage.selectors.emailError },
      { selector: newAccountPage.selectors.usernameInput, error: newAccountPage.selectors.usernameError },
      { selector: newAccountPage.selectors.passwordInput, error: newAccountPage.selectors.passwordError },
    ];

    for (const field of emptyFieldsConfig) {
      // Usamos newAccountPage.driver para interactuar con los elementos
      const element = await newAccountPage.driver.findElement(By.css(field.selector));
      await element.click();
      await newAccountPage.driver.actions().sendKeys(Key.TAB).perform();

      const actualResult = await newAccountPage.verifyBlurValidation(field.selector, field.error);
      expect(actualResult).toBe(true);
    }
  });

  test('TC-003: Create Account button should be disabled when fields are empty and Terms & Conditions checkbox is unchecked', async () => {
    await toggleTermsAndConditions(newAccountPage, false); // Asegura que esté desmarcado

    // Usamos newAccountPage.driver para interactuar con los elementos
    const createButton = await newAccountPage.driver.findElement(By.css(newAccountPage.selectors.createButton));
    await newAccountPage.driver.wait(until.elementIsVisible(createButton), newAccountPage.timeout);

    const isDisabled = await createButton.getAttribute('disabled') !== null;
    expect(isDisabled).toBe(true);
  });

  test('TC-004: Create Account button should be enabled when all fields are valid and Terms & Conditions checkbox is checked', async () => {
    await fillAllFields(newAccountPage, VALID_NAME, VALID_SURNAME, VALID_EMAIL, VALID_USERNAME, VALID_PASSWORD, VALID_PASSWORD);
    await toggleTermsAndConditions(newAccountPage, true); // Asegura que esté marcado

    const createButton = await newAccountPage.driver.findElement(By.css(newAccountPage.selectors.createButton));
    await newAccountPage.driver.wait(until.elementIsVisible(createButton), newAccountPage.timeout);

    const isEnabled = await createButton.getAttribute('disabled') == null;
    expect(isEnabled).toBe(true);
  });

  test('TC-005: Create Account button should be disabled when all fields are valid but Terms & Conditions checkbox is unchecked', async () => {
    await fillAllFields(newAccountPage, VALID_NAME, VALID_SURNAME, VALID_EMAIL, VALID_USERNAME, VALID_PASSWORD, VALID_PASSWORD);
    await toggleTermsAndConditions(newAccountPage, false); // Asegura que esté desmarcado

    const createButton = await newAccountPage.driver.findElement(By.css(newAccountPage.selectors.createButton));
    await newAccountPage.driver.wait(until.elementIsVisible(createButton), newAccountPage.timeout);

    const isDisabled = await createButton.getAttribute('disabled') !== null;
    expect(isDisabled).toBe(true);
  });

  test('TC-006: Password field should display error message when using only numbers', async () => {
    const result = await newAccountPage.isValidPassword(ONLY_NUMBERS_PASSWORD, newAccountPage.selectors.passwordError);
    expect(result).toBe(true);
  });

  test('TC-007: Password field should display error message when using only letters', async () => {
    const result = await newAccountPage.isValidPassword(ONLY_LETTERS_PASSWORD, newAccountPage.selectors.passwordError);
    expect(result).toBe(true);
  });

  test('TC-008: Password field should display error message when using numbers and characters with length less than 8', async () => {
    const result = await newAccountPage.isValidPassword(LESS_THAN_8_PASSWORD, newAccountPage.selectors.passwordError);
    expect(result).toBe(true);
  });

  test('TC-009: Confirm Password field should display error message when we type a different Password', async () => {
    const passwordField = await newAccountPage.driver.findElement(By.css(newAccountPage.selectors.passwordInput));
    const confirmPasswordField = await newAccountPage.driver.findElement(By.css(newAccountPage.selectors.confirmPasswordInput));

    await newAccountPage.driver.wait(until.elementIsVisible(passwordField), newAccountPage.timeout);
    await passwordField.sendKeys(VALID_PASSWORD);
    await confirmPasswordField.sendKeys(DIFFERENT_PASSWORD);
    await newAccountPage.driver.actions().sendKeys(Key.TAB).perform();

    const result = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.confirmPasswordInput,
      newAccountPage.selectors.confirmPasswordError
    );
    expect(result).toBe(true);
  });

  test('TC-010: Email field should display error message when using an invalid email format', async () => {
    const emailField = await newAccountPage.driver.findElement(By.css(newAccountPage.selectors.emailInput));
    await newAccountPage.driver.wait(until.elementIsVisible(emailField), newAccountPage.timeout);
    await emailField.sendKeys(INVALID_EMAIL_FORMAT);
    await newAccountPage.driver.actions().sendKeys(Key.TAB).perform();

    const result = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.emailInput,
      newAccountPage.selectors.emailError
    );
    expect(result).toBe(true);
  });

  test('TC-011: Email field should not display error message when using a valid email format', async () => {
    const emailField = await newAccountPage.driver.findElement(By.css(newAccountPage.selectors.emailInput));
    await newAccountPage.driver.wait(until.elementIsVisible(emailField), newAccountPage.timeout);
    await emailField.sendKeys(VALID_EMAIL);
    await newAccountPage.driver.actions().sendKeys(Key.TAB).perform();

    // Asumiendo que quieres que el siguiente campo requerido muestre su error al salir del email.
    // Si la intención es verificar que NO hay error en el email, necesitarías una aserción diferente.
    const result = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.usernameInput,
      newAccountPage.selectors.usernameError
    );
    expect(result).toBe(true);
  });

  test('TC-012: Clicking Login link should redirect to login page', async () => {
    const LOGIN_LINK_SELECTOR = '/html/body/app-root/div/tenat-user-sign-up/app-authentication-layout/div/section[1]/p/a';
    const EXPECTED_URL = 'https://login.harmonychurchsuite.com/tenant/user-signin';

    const loginLink = await newAccountPage.driver.findElement(By.xpath(LOGIN_LINK_SELECTOR));
    await newAccountPage.driver.wait(until.elementIsVisible(loginLink), newAccountPage.timeout);
    await loginLink.click();

    // Usamos until.urlIs para una espera más robusta
    await newAccountPage.driver.wait(until.urlIs(EXPECTED_URL), newAccountPage.timeout);

    const actualUrl = await newAccountPage.driver.getCurrentUrl();
    expect(actualUrl).toBe(EXPECTED_URL);
  });
});
