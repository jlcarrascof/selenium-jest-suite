const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until, Key } = require('selenium-webdriver');

const TIMEOUT = 120000;
const BASE_URL = 'https://login.harmonychurchsuite.com/tenant/user-signup?tenant=qa';
const CURRENT_BROWSER = 'chrome';

let driver;
let newAccountPage;

beforeAll(async () => {
  const driverFactory = new DriverFactory(CURRENT_BROWSER, TIMEOUT);
  driver = await driverFactory.initDriver();
  newAccountPage = PageFactory.createPage('newAccount', driver, BASE_URL, TIMEOUT);
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

    const result = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.nameInput,
      'Name is required'
    );

    expect(result).toBe(true);
  });

  test('TC-002: Surname field should display error message when is empty', async () => {
    await newAccountPage.open();

    const surnameField = await driver.findElement(By.css(newAccountPage.selectors.surnameInput));
    await surnameField.click();

    const result = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.surnameInput,
      'Surname is required'
    );

    expect(result).toBe(true);
  });

  test('TC-003: Email field should display error message when is empty', async () => {
    await newAccountPage.open();

    const emailField = await driver.findElement(By.css(newAccountPage.selectors.emailInput));
    await emailField.click();

    const result = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.emailInput,
      'Please enter a valid email'
    );

    expect(result).toBe(true);
  });

  test('TC-004: Username field should display error message when is empty', async () => {
    await newAccountPage.open();

    const usernameField = await driver.findElement(By.css(newAccountPage.selectors.
      usernameInput));
    await usernameField.click();

    const result = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.usernameInput,
      'Username is required'
    );

    expect(result).toBe(true);
  });

  test('TC-005: Password field should display error message when is empty', async () => {
    await newAccountPage.open();

    const passwordField = await driver.findElement(By.css(newAccountPage.selectors.passwordInput));
    await passwordField.click();

    const result = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.passwordInput,
      'Password must be at least 8 characters'
    );

    expect(result).toBe(true);
  });

  /*
  test('TC-006: Terms and Conditions checkbox should display error message when unchecked', async () => {
    await newAccountPage.open();

    // Move focus to the password field
    const passwordField = await driver.findElement(By.css(newAccountPage.selectors.passwordInput));
    await passwordField.click();
    await newAccountPage.verifyBlurValidation(newAccountPage.selectors.passwordInput, 'Password is required');
    await driver.actions().sendKeys(Key.TAB).perform(); // Confirm Password
    await driver.actions().sendKeys(Key.TAB).perform(); // Terms Checkbox
    await driver.actions().sendKeys(Key.TAB).perform(); // Extra TAB to ensure focus is on the checkbox

    const termsCheckbox = await driver.findElement(By.css(newAccountPage.selectors.termsCheckbox));
    await termsCheckbox.click(); // Uncheck the checkbox
    await termsCheckbox.click(); // Click again to ensure it is unchecked
    const result = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.termsCheckbox,
      'Terms and Conditions'
    );

    expect(result).toBe(true);
  });
  */
});
