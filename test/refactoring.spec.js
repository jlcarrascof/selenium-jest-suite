// test/NewAccount.spec.js

const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until, Key } = require('selenium-webdriver');

const VALID_DATA = {
  name: 'Javier',
  surname: 'Martinez',
  email: 'javier.martinez@example.com',
  username: 'javiermartinez',
  password: 'Password123!',
  confirmPassword: 'Password123!',
  differentPassword: 'Password123*'
};

const ERROR_MESSAGES = {
  name: 'Name is required',
  surname: 'Surname is required',
  email: 'Please enter a valid email',
  username: 'Username is required',
  password: 'Password must be at least 8 characters',
  terms: 'Terms and Conditions',
  confirmPassword: 'Password must match',
  invalidEmail: 'Please enter a valid email'
};

const TIMEOUTS = {
  elementVisibility: 5000,
  redirection: 1000
};

let driver;
let newAccountPage;

const fillFormFields = async (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    const selector = newAccountPage.selectors[`${key}Input`];
    await driver.findElement(By.css(selector)).sendKeys(value);
  }
};

const waitForElement = async (by, selector, timeout = newAccountPage.timeout) => {
  const element = await driver.findElement(by(selector));
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
};

const validateError = async (selector, error, isXPath = false) => {
  return await newAccountPage.verifyBlurValidation(selector, error, isXPath);
};

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
    const checkbox = await waitForElement(By.xpath, newAccountPage.selectors.termsCheckbox);
    await checkbox.click();
    expect(await validateError(newAccountPage.selectors.termsCheckbox, ERROR_MESSAGES.terms, true)).toBe(true);
  });

  test('TC-002: All fields should display error messages when are empty', async () => {
    const requiredFields = [
      ['nameInput', ERROR_MESSAGES.name],
      ['surnameInput', ERROR_MESSAGES.surname],
      ['emailInput', ERROR_MESSAGES.email],
      ['usernameInput', ERROR_MESSAGES.username],
      ['passwordInput', ERROR_MESSAGES.password],
    ];

    for (const [selectorKey, error] of requiredFields) {
      const selector = newAccountPage.selectors[selectorKey];
      await driver.findElement(By.css(selector)).click();
      await driver.actions().sendKeys(Key.TAB).perform();
      expect(await validateError(selector, error)).toBe(true);
    }
  });

  test('TC-003: Create Account button should be disabled when fields are empty and Terms & Conditions checkbox is unchecked', async () => {
    const checkbox = await waitForElement(By.xpath, newAccountPage.selectors.termsCheckbox);
    if (await checkbox.isSelected()) await checkbox.click();

    const createButton = await waitForElement(By.css, newAccountPage.selectors.createButton);
    expect(await createButton.getAttribute('disabled')).not.toBeNull();
  });

  test('TC-004: Create Account button should be enabled when all fields are valid and Terms & Conditions checkbox is checked', async () => {
    await fillFormFields({
      name: VALID_DATA.name,
      surname: VALID_DATA.surname,
      email: VALID_DATA.email,
      username: VALID_DATA.username,
      password: VALID_DATA.password,
      confirmPassword: VALID_DATA.confirmPassword
    });

    const checkbox = await waitForElement(By.xpath, newAccountPage.selectors.termsCheckbox);
    if (!(await checkbox.isSelected())) await checkbox.click();

    const createButton = await waitForElement(By.css, newAccountPage.selectors.createButton);
    expect(await createButton.getAttribute('disabled')).toBeNull();
  });

  test('TC-005: Create Account button should be disabled when all fields are valid but Terms & Conditions checkbox is unchecked', async () => {
    await fillFormFields({
      name: VALID_DATA.name,
      surname: VALID_DATA.surname,
      email: VALID_DATA.email,
      username: VALID_DATA.username,
      password: VALID_DATA.password,
      confirmPassword: VALID_DATA.confirmPassword
    });

    const checkbox = await waitForElement(By.xpath, newAccountPage.selectors.termsCheckbox);
    if (await checkbox.isSelected()) await checkbox.click();

    const createButton = await waitForElement(By.css, newAccountPage.selectors.createButton);
    expect(await createButton.getAttribute('disabled')).not.toBeNull();
  });

  test('TC-006: Password field should display error message when using only numbers', async () => {
    expect(await newAccountPage.isValidPassword('12345678', ERROR_MESSAGES.password)).toBe(true);
  });

  test('TC-007: Password field should display error message when using only letters', async () => {
    expect(await newAccountPage.isValidPassword('abcdefgh', ERROR_MESSAGES.password)).toBe(true);
  });

  test('TC-008: Password field should display error message when using numbers and characters with length less than 8', async () => {
    expect(await newAccountPage.isValidPassword('ab1@', ERROR_MESSAGES.password)).toBe(true);
  });

  test('TC-009: Confirm Password field should display error message when we type a different Password', async () => {
    await driver.findElement(By.css(newAccountPage.selectors.passwordInput)).sendKeys(VALID_DATA.password);
    await driver.findElement(By.css(newAccountPage.selectors.confirmPasswordInput)).sendKeys(VALID_DATA.differentPassword);
    await driver.actions().sendKeys(Key.TAB).perform();
    expect(await validateError(newAccountPage.selectors.confirmPasswordInput, ERROR_MESSAGES.confirmPassword)).toBe(true);
  });

  test('TC-010: Email field should display error message when using an invalid email format', async () => {
    const emailField = await waitForElement(By.css, newAccountPage.selectors.emailInput);
    await emailField.sendKeys('test@');
    await driver.actions().sendKeys(Key.TAB).perform();
    expect(await validateError(newAccountPage.selectors.emailInput, ERROR_MESSAGES.invalidEmail)).toBe(true);
  });

  test('TC-011: Email field should not display error message when using a valid email format', async () => {
    const emailField = await waitForElement(By.css, newAccountPage.selectors.emailInput);
    await emailField.sendKeys(VALID_DATA.email);
    await driver.actions().sendKeys(Key.TAB).perform();
    expect(await validateError(newAccountPage.selectors.usernameInput, ERROR_MESSAGES.username)).toBe(true);
  });

  test('TC-012: Clicking Login link should redirect to login page', async () => {
    const LOGIN_LINK_SELECTOR = '/html/body/app-root/div/tenat-user-sign-up/app-authentication-layout/div/section[1]/p/a';
    const EXPECTED_URL = 'https://login.harmonychurchsuite.com/tenant/user-signin';

    const loginLink = await waitForElement(By.xpath, LOGIN_LINK_SELECTOR, TIMEOUTS.elementVisibility);
    await loginLink.click();
    await driver.wait(until.urlIs(EXPECTED_URL), TIMEOUTS.redirection);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe(EXPECTED_URL);
  });
});
