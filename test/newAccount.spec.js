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

// Helpers
async function fillAllFields(driver, newAccountPage, name, surname, email, username, password, confirmPassword) {
  await driver.findElement(By.css(newAccountPage.selectors.nameInput)).sendKeys(name);
  await driver.findElement(By.css(newAccountPage.selectors.surnameInput)).sendKeys(surname);
  await driver.findElement(By.css(newAccountPage.selectors.emailInput)).sendKeys(email);
  await driver.findElement(By.css(newAccountPage.selectors.usernameInput)).sendKeys(username);
  await driver.findElement(By.css(newAccountPage.selectors.passwordInput)).sendKeys(password);
  await driver.findElement(By.css(newAccountPage.selectors.confirmPasswordInput)).sendKeys(confirmPassword);
}

async function toggleTermsAndConditions(driver, newAccountPage, shouldBeChecked) {
  const termsCheckbox = await driver.findElement(By.xpath(newAccountPage.selectors.termsCheckbox));
  await driver.wait(until.elementIsVisible(termsCheckbox), newAccountPage.timeout);

  const isChecked = await termsCheckbox.isSelected();
  if ((shouldBeChecked && !isChecked) || (!shouldBeChecked && isChecked)) {
    await termsCheckbox.click();
  }
}

beforeAll(async () => {
  const driverFactory = new DriverFactory(global.testConfig.currentBrowser, global.testConfig.timeout);

  driver = await driverFactory.initDriver();

  newAccountPage = PageFactory.createPage('newAccount', driver, global.testConfig.baseNewAccountUrl, global.testConfig.timeout);

  if (!newAccountPage.errorMessages) {
    newAccountPage.errorMessages = {
      password: 'Password must be at least 8 characters',
      terms: 'Terms and Conditions',
      nameRequired: 'Name is required',
      surnameRequired: 'Surname is required',
      emailInvalid: 'Please enter a valid email',
      usernameRequired: 'Username is required',
      passwordMatch: 'Password must match'
    };
  }
});

afterAll(async () => {
  if (driver) await driver.quit();
});

describe('Test Suite: New Account Functionality of Harmony Church', () => {

  beforeEach(async () => {
    await newAccountPage.open();
  });

  test('TC-001: Terms and Conditions checkbox should display error message when unchecked', async () => {
    const termsCheckbox = await driver.findElement(By.xpath(newAccountPage.selectors.termsCheckbox));

    await driver.wait(until.elementIsVisible(termsCheckbox), newAccountPage.timeout);
    await termsCheckbox.click();

    const TEXT = 'Terms and Conditions';
    const isXPath = true;

    const actualResult = await newAccountPage.verifyBlurValidation(newAccountPage.selectors.termsCheckbox, TEXT, isXPath);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-002: All fields should display error messages when are empty', async () => {
    const fields = [
      { selector: newAccountPage.selectors.nameInput, error: 'Name is required' },
      { selector: newAccountPage.selectors.surnameInput, error: 'Surname is required' },
      { selector: newAccountPage.selectors.emailInput, error: 'Please enter a valid email' },
      { selector: newAccountPage.selectors.usernameInput, error: 'Username is required' },
      { selector: newAccountPage.selectors.passwordInput, error: 'Password must be at least 8 characters' },
    ];

    for (const field of fields) {
      const element = await driver.findElement(By.css(field.selector));

      await element.click();
      await driver.actions().sendKeys(Key.TAB).perform();

      const actualResult = await newAccountPage.verifyBlurValidation(field.selector, field.error);
      const expectedResult = true;

      expect(actualResult).toBe(expectedResult);
    }
  });

  test('TC-003: Create Account button should be disabled when fields are empty and Terms & Conditions checkbox is unchecked', async () => {
    const termsCheckbox = await driver.findElement(By.xpath(newAccountPage.selectors.termsCheckbox));

    await driver.wait(until.elementIsVisible(termsCheckbox), newAccountPage.timeout);

    if (await termsCheckbox.isSelected()) {
      await termsCheckbox.click();
    }

    const createButton = await driver.findElement(By.css(newAccountPage.selectors.createButton));
    await driver.wait(until.elementIsVisible(createButton), newAccountPage.timeout);

    const actualResult = await createButton.getAttribute('disabled') !== null;
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-004: Create Account button should be enabled when all fields are valid and Terms & Conditions checkbox is checked', async () => {
    await driver.findElement(By.css(newAccountPage.selectors.nameInput)).sendKeys(VALID_NAME);
    await driver.findElement(By.css(newAccountPage.selectors.surnameInput)).sendKeys(VALID_SURNAME);
    await driver.findElement(By.css(newAccountPage.selectors.emailInput)).sendKeys(VALID_EMAIL);
    await driver.findElement(By.css(newAccountPage.selectors.usernameInput)).sendKeys(VALID_USERNAME);
    await driver.findElement(By.css(newAccountPage.selectors.passwordInput)).sendKeys(VALID_PASSWORD);
    await driver.findElement(By.css(newAccountPage.selectors.confirmPasswordInput)).sendKeys(VALID_PASSWORD);

    const termsCheckbox = await driver.findElement(By.xpath(newAccountPage.selectors.termsCheckbox));
    if (!(await termsCheckbox.isSelected())) {
      await termsCheckbox.click();
    }

    const createButton = await driver.findElement(By.css(newAccountPage.selectors.createButton));
    await driver.wait(until.elementIsVisible(createButton), newAccountPage.timeout);

    const actualResult = await createButton.getAttribute('disabled') == null;
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-005: Create Account button should be disabled when all fields are valid but Terms & Conditions checkbox is unchecked', async () => {
    await driver.findElement(By.css(newAccountPage.selectors.nameInput)).sendKeys(VALID_NAME);
    await driver.findElement(By.css(newAccountPage.selectors.surnameInput)).sendKeys(VALID_SURNAME);
    await driver.findElement(By.css(newAccountPage.selectors.emailInput)).sendKeys(VALID_EMAIL);
    await driver.findElement(By.css(newAccountPage.selectors.usernameInput)).sendKeys(VALID_USERNAME);
    await driver.findElement(By.css(newAccountPage.selectors.passwordInput)).sendKeys(VALID_PASSWORD);
    await driver.findElement(By.css(newAccountPage.selectors.confirmPasswordInput)).sendKeys(VALID_PASSWORD);

    const termsCheckbox = await driver.findElement(By.xpath(newAccountPage.selectors.termsCheckbox));
    if (await termsCheckbox.isSelected()) {
      await termsCheckbox.click();
    }

    const createButton = await driver.findElement(By.css(newAccountPage.selectors.createButton));
    await driver.wait(until.elementIsVisible(createButton), newAccountPage.timeout);

    const isDisabled = await createButton.getAttribute('disabled') !== null;

    expect(isDisabled).toBe(true);
  });

  test('TC-006: Password field should display error message when using only numbers', async () => {
    const ONLY_NUMBERS_PASSWORD = '12345678';
    const result = await newAccountPage.isValidPassword(ONLY_NUMBERS_PASSWORD, PASSWORD_ERROR_MESSAGE);

    expect(result).toBe(true);
  });

  test('TC-007: Password field should display error message when using only letters', async () => {
    const ONLY_LETTERS_PASSWORD = 'abcdefgh';

    const result = await newAccountPage.isValidPassword(ONLY_LETTERS_PASSWORD, PASSWORD_ERROR_MESSAGE);

    expect(result).toBe(true);
  });

  test('TC-008: Password field should display error message when using numbers and characters with length less than 8', async () => {
    const LESS_THAN_8_PASSWORD = 'ab1@';

    const result = await newAccountPage.isValidPassword(LESS_THAN_8_PASSWORD, PASSWORD_ERROR_MESSAGE);

    expect(result).toBe(true);
  });

  test('TC-009: Confirm Password field should display error message when we type a different Password', async () => {
    const passwordField = await driver.findElement(By.css(newAccountPage.selectors.passwordInput));
    const confirmPasswordField = await driver.findElement(By.css(newAccountPage.selectors.confirmPasswordInput));

    await driver.wait(until.elementIsVisible(passwordField), newAccountPage.timeout);
    await passwordField.sendKeys(VALID_PASSWORD);
    await confirmPasswordField.sendKeys(DIFFERENT_PASSWORD);
    await driver.actions().sendKeys(Key.TAB).perform();

    const WARNING_MESSAGE = 'Password must match';

    const result = await newAccountPage.verifyBlurValidation(newAccountPage.selectors.confirmPasswordInput, WARNING_MESSAGE);

    expect(result).toBe(true);
  });

  test('TC-010: Email field should display error message when using an invalid email format', async () => {
    const INVALID_EMAIL = 'test@';
    const MESSAGE_EMAIL_ERROR = 'Please enter a valid email';

    const emailField = await driver.findElement(By.css(newAccountPage.selectors.emailInput));

    await driver.wait(until.elementIsVisible(emailField), newAccountPage.timeout);
    await emailField.sendKeys(INVALID_EMAIL);
    await driver.actions().sendKeys(Key.TAB).perform();

    const result = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.emailInput,
      MESSAGE_EMAIL_ERROR
    );

    expect(result).toBe(true);
  });

  test('TC-011: Email field should not display error message when using a valid email format', async () => {
    const MESSAGE_EMAIL = 'Username is required';

    const emailField = await driver.findElement(By.css(newAccountPage.selectors.emailInput));

    await driver.wait(until.elementIsVisible(emailField), newAccountPage.timeout);
    await emailField.sendKeys(VALID_EMAIL);
    await driver.actions().sendKeys(Key.TAB).perform();

    const result = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.usernameInput,
      MESSAGE_EMAIL
    );

    expect(result).toBe(true);
  });

  test('TC-012: Clicking Login link should redirect to login page', async () => {
    const ELEMENT_VISIBILITY_TIMEOUT = 5000;
    const REDIRECTION_WAIT = 1000;
    const LOGIN_LINK_SELECTOR = '/html/body/app-root/div/tenat-user-sign-up/app-authentication-layout/div/section[1]/p/a';
    const EXPECTED_URL = 'https://login.harmonychurchsuite.com/tenant/user-signin';

    const loginLink = await driver.findElement(By.xpath(LOGIN_LINK_SELECTOR));

    await driver.wait(until.elementIsVisible(loginLink), ELEMENT_VISIBILITY_TIMEOUT);
    await loginLink.click();
    await driver.sleep(REDIRECTION_WAIT);

    const actualUrl = await driver.getCurrentUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });
});
