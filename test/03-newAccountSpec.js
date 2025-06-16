const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until, Key } = require('selenium-webdriver');

const VALID_NAME = 'Javier';
const VALID_SURNAME = 'Martinez';
const VALID_EMAIL = 'javier.martinez@example.com';
const VALID_USERNAME = 'javiermartinez';
const VALID_PASSWORD = 'Password123!';
const DIFFERENT_PASSWORD = 'Password123*';
const PASSWORD_ERROR_MESSAGE = 'Password must be at least 8 characters';

let driver;
let newAccountPage;

beforeAll(async () => {
  const driverFactory = new DriverFactory(global.testConfig.cureentBrower, global.testConfig.timeout);

  driver = await driverFactory.initDriver();
  
  newAccountPage = PageFactory.createPage('newAccount', driver, global.testConfig.baseUrl, global.testConfig.timeout);
});

afterAll(async () => {
  if (driver) await driver.quit();
});

describe('Test Suite: New Account Functionality of Harmony Church', () => {
  test('TC-001: Name field should display error message when is empty', async () => {

    await newAccountPage.open();

    // Put focus on name
    const nameField = await driver.findElement(By.css(newAccountPage.selectors.nameInput));
    await nameField.click();

    const WARNING_MESSAGE = 'Name is required';

    const actualResult = await newAccountPage.verifyBlurValidation(newAccountPage.selectors.nameInput, WARNING_MESSAGE);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-002: Surname field should display error message when is empty', async () => {

    await newAccountPage.open();

    const surnameField = await driver.findElement(By.css(newAccountPage.selectors.surnameInput));
    await surnameField.click();

    const WARNING_MESSAGE = 'Surname is required';

    const actualResult = await newAccountPage.verifyBlurValidation(newAccountPage.selectors.surnameInput, WARNING_MESSAGE);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-003: Email field should display error message when is empty', async () => {

    await newAccountPage.open();

    const emailField = await driver.findElement(By.css(newAccountPage.selectors.emailInput));
    await emailField.click();

    const WARNING_MESSAGE = 'Please enter a valid email';

    const actualResult = await newAccountPage.verifyBlurValidation(newAccountPage.selectors.emailInput, WARNING_MESSAGE);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-004: Username field should display error message when is empty', async () => {

    await newAccountPage.open();

    const usernameField = await driver.findElement(By.css(newAccountPage.selectors.usernameInput));

    await usernameField.click();

    const WARNING_MESSAGE = 'Username is required';
    
    const actualResult = await newAccountPage.verifyBlurValidation(newAccountPage.selectors.usernameInput, WARNING_MESSAGE);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-005: Password field should display error message when is empty', async () => {

    await newAccountPage.open();

    const passwordField = await driver.findElement(By.css(newAccountPage.selectors.passwordInput));
    await passwordField.click();

    const WARNING_MESSAGE = 'Password must be at least 8 characters';
    
    const actualResult = await newAccountPage.verifyBlurValidation(newAccountPage.selectors.passwordInput, WARNING_MESSAGE);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-006: Terms and Conditions checkbox should display error message when unchecked', async () => {

    await newAccountPage.open();

    const termsCheckbox = await driver.findElement(By.xpath(newAccountPage.selectors.termsCheckbox));
    await driver.wait(until.elementIsVisible(termsCheckbox), newAccountPage.timeout);
    await termsCheckbox.click(); // Unclick if already checked

    const TEXT = 'Terms and Conditions';
    const isXPath = true;

    const actualResult = await newAccountPage.verifyBlurValidation(newAccountPage.selectors.termsCheckbox, TEXT, isXPath);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-007: All fields should display error messages when are empty', async () => {

    await newAccountPage.open();

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

  test('TC-008: Create Account button should be disabled when fields are empty and Terms & Conditions checkbox is unchecked', async () => {
   
    await newAccountPage.open();

    const termsCheckbox = await driver.findElement(By.xpath(newAccountPage.selectors.termsCheckbox));
   
    await driver.wait(until.elementIsVisible(termsCheckbox), newAccountPage.timeout);

    if (await termsCheckbox.isSelected()) {
      await termsCheckbox.click(); // Uncheck if already checked
    }

    const createButton = await driver.findElement(By.css(newAccountPage.selectors.createButton));
    await driver.wait(until.elementIsVisible(createButton), newAccountPage.timeout);

    // Check if the button is enabled
    const actualResult = await createButton.getAttribute('disabled') !== null;
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-009: Create Account button should be enabled when all fields are valid and Terms & Conditions checkbox is checked', async () => {

    await newAccountPage.open();

    await driver.findElement(By.css(newAccountPage.selectors.nameInput)).sendKeys(VALID_NAME);
    await driver.findElement(By.css(newAccountPage.selectors.surnameInput)).sendKeys(VALID_SURNAME);
    await driver.findElement(By.css(newAccountPage.selectors.emailInput)).sendKeys(VALID_EMAIL);
    await driver.findElement(By.css(newAccountPage.selectors.usernameInput)).sendKeys(VALID_USERNAME);
    await driver.findElement(By.css(newAccountPage.selectors.passwordInput)).sendKeys(VALID_PASSWORD);
    await driver.findElement(By.css(newAccountPage.selectors.confirmPasswordInput)).sendKeys(VALID_PASSWORD);

    // Check the Terms and Conditions checkbox
    const termsCheckbox = await driver.findElement(By.xpath(newAccountPage.selectors.termsCheckbox));
    if (!(await termsCheckbox.isSelected())) {
      await termsCheckbox.click();
    }

    // wait for the button to be visible
    const createButton = await driver.findElement(By.css(newAccountPage.selectors.createButton));
    await driver.wait(until.elementIsVisible(createButton), newAccountPage.timeout);

    // Check if the button is enabled
    const actualResult = await createButton.getAttribute('disabled') !== null;
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-010: Create Account button should be disabled when all fields are valid but Terms & Conditions checkbox is unchecked', async () => {

    await newAccountPage.open();

    await driver.findElement(By.css(newAccountPage.selectors.nameInput)).sendKeys(VALID_NAME);
    await driver.findElement(By.css(newAccountPage.selectors.surnameInput)).sendKeys(VALID_SURNAME);
    await driver.findElement(By.css(newAccountPage.selectors.emailInput)).sendKeys(VALID_EMAIL);
    await driver.findElement(By.css(newAccountPage.selectors.usernameInput)).sendKeys(VALID_USERNAME);
    await driver.findElement(By.css(newAccountPage.selectors.passwordInput)).sendKeys(VALID_PASSWORD);
    await driver.findElement(By.css(newAccountPage.selectors.confirmPasswordInput)).sendKeys(VALID_PASSWORD);

    // Uncheck the Terms and Conditions checkbox
    const termsCheckbox = await driver.findElement(By.xpath(newAccountPage.selectors.termsCheckbox));
    if (await termsCheckbox.isSelected()) {
      await termsCheckbox.click();
    }

    const createButton = await driver.findElement(By.css(newAccountPage.selectors.createButton));
    
    await driver.wait(until.elementIsVisible(createButton), newAccountPage.timeout);

    const isDisabled = await createButton.getAttribute('disabled') !== null;

    expect(isDisabled).toBe(true);
  });

  test('TC-011: Password field should display error message when using only numbers', async () => {

    const ONLY_NUMBERS_PASSWORD = '12345678';

    const result = await newAccountPage.isValidPassword(ONLY_NUMBERS_PASSWORD, PASSWORD_ERROR_MESSAGE);

    expect(result).toBe(true);
  });

  test('TC-012: Password field should display error message when using only letters', async () => {

    const ONLY_LETTERS_PASSWORD = 'abcdefgh';

    const result = await newAccountPage.isValidPassword(ONLY_LETTERS_PASSWORD, PASSWORD_ERROR_MESSAGE);

    expect(result).toBe(true);
  });

  test('TC-013: Password field should display error message when using numbers and characters with length less than 8', async () => {

    const LESS_THAN_8_PASSWORD = 'ab1@';

    const result = await newAccountPage.isValidPassword(LESS_THAN_8_PASSWORD, PASSWORD_ERROR_MESSAGE);

    expect(result).toBe(true);
  });

  test('TC-014: Confirm Password field should display error message when we type a different Password', async () => {

    await newAccountPage.open();

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

  test('TC-015: Email field should display error message when using an invalid email format', async () => {
    const INVALID_EMAIL = 'test@';
    const MESSAGE_EMAIL_ERROR = 'Please enter a valid email';

    await newAccountPage.open();

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

  test('TC-016: Email field should not display error message when using a valid email format', async () => {
    const MESSAGE_EMAIL = 'Username is required';

    await newAccountPage.open();

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

  test('TC-017: Clicking Login link should redirect to login page', async () => {
    await newAccountPage.open();
    const loginLink = await driver.findElement(By.xpath('/html/body/app-root/div/tenat-user-sign-up/app-authentication-layout/div/section[1]/p/a'));
    await driver.wait(until.elementIsVisible(loginLink), 5000);
    await loginLink.click();
    await driver.sleep(1000); // Espera a que la redirección ocurra
    const actualUrl = await driver.getCurrentUrl();
    const expectedUrl = 'https://login.harmonychurchsuite.com/tenant/user-signin';
    expect(actualUrl).toBe(expectedUrl);
  }); // Timeout total de 10 segundos

});
