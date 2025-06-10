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

  test('TC-006: Terms and Conditions checkbox should display error message when unchecked', async () => {
    await newAccountPage.open();
    const termsCheckbox = await driver.findElement(By.xpath(newAccountPage.selectors.termsCheckbox));
    await driver.wait(until.elementIsVisible(termsCheckbox), TIMEOUT);
    await termsCheckbox.click(); // Unclick if already checked
    const result = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.termsCheckbox,
      'Terms and Conditions', true
    );
    expect(result).toBe(true);
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
      const result = await newAccountPage.verifyBlurValidation(field.selector, field.error);
      expect(result).toBe(true);
    }
  });
});
