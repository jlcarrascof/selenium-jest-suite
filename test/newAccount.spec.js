// test/NewAccount.spec.js
const { By, until, Key } = require('selenium-webdriver');
const { CONFIG, initPages, driver: getDriver, newAccountPage: getNewAccountPage } = require('./setup/newAccountTestSetup');

let driver, newAccountPage;

beforeAll(async () => {
  const pages = await initPages();
  driver = pages.driver;
  newAccountPage = pages.newAccountPage;
});

afterAll(async () => {
  if (driver) await driver.quit();
});

describe('Test Suite: New Account Functionality of Harmony Church', () => {
  beforeEach(async () => {
    await newAccountPage.open();
  });

  test('TC-001: Terms and Conditions checkbox should display error message when unchecked', async () => {
    await newAccountPage.submitWithoutTerms();

    const actualResult = await newAccountPage.hasTermsError();
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-002: All fields should display error messages when are empty', async () => {
    const requiredFields = [
      ['nameInput',   CONFIG.ERROR_MESSAGES.name],
      ['surnameInput',CONFIG.ERROR_MESSAGES.surname],
      ['emailInput',  CONFIG.ERROR_MESSAGES.email],
      ['usernameInput',CONFIG.ERROR_MESSAGES.username],
      ['passwordInput',CONFIG.ERROR_MESSAGES.password],
    ];

    for (const [fieldKey, expectedMessage] of requiredFields) {
      const actualResult = await newAccountPage.requiredErrorVisible(fieldKey, expectedMessage);
      const expectedResult = true;

      expect(actualResult).toBe(expectedResult);
    }
  });

  test.each([
    {
      tc: 'TC-003',
      description: 'Create Account button should be disabled when fields are empty and Terms & Conditions checkbox is unchecked',
      fillFields: false,
      acceptTerms: false,
      expectedResult: false
    },
    {
      tc: 'TC-004',
      description: 'Create Account button should be enabled when all fields are valid and Terms & Conditions checkbox is checked',
      fillFields: true,
      acceptTerms: true,
      expectedResult: true
    },
    {
      tc: 'TC-005',
      description: 'Create Account button should be disabled when all fields are valid but Terms & Conditions checkbox is unchecked',
      fillFields: true,
      acceptTerms: false,
      expectedResult: false
    }
  ])('$tc: $description', async ({ fillFields, acceptTerms, expectedResult }) => {
    if (fillFields) {
      await newAccountPage.fillAllFieldsWithValidData(CONFIG.VALID_DATA);
    }

    await newAccountPage.setTermsAndConditions(acceptTerms);

    const actualResult = await newAccountPage.isCreateAccountButtonEnabled();
    expect(actualResult).toBe(expectedResult);
  });

  test.each([
    ['TC-006', 'only numbers', CONFIG.INVALID_PASSWORDS.onlyNumbers, CONFIG.ERROR_MESSAGES.password],
    ['TC-007', 'only letters', CONFIG.INVALID_PASSWORDS.onlyLetters, CONFIG.ERROR_MESSAGES.password],
    ['TC-008', 'short length (< 8 chars)', CONFIG.INVALID_PASSWORDS.shortLength, CONFIG.ERROR_MESSAGES.password],
  ])('%s: Password field should display error message when using %s', async (tc, desc, inputPassword, expectedMessage) => {
    const actualResult = await newAccountPage.showsPasswordRequiredError(inputPassword, expectedMessage);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

/*
  test('TC-009: Confirm Password field should display error message when we type a different Password', async () => {
    await driver.findElement(By.css(newAccountPage.selectors.passwordInput)).sendKeys(VALID_DATA.password);
    await driver.findElement(By.css(newAccountPage.selectors.confirmPasswordInput)).sendKeys(VALID_DATA.differentPassword);
    await driver.actions().sendKeys(Key.TAB).perform();
    await validateError(newAccountPage.selectors.confirmPasswordInput, ERROR_MESSAGES.confirmPassword);
  });

  test('TC-010: Email field should display error message when using an invalid email format', async () => {
    const emailField = await waitForElement(By.css, newAccountPage.selectors.emailInput);

    await emailField.sendKeys('test@');
    await driver.actions().sendKeys(Key.TAB).perform();
    await validateError(newAccountPage.selectors.emailInput, ERROR_MESSAGES.invalidEmail);
  });

  test('TC-011: Email field should not display error message when using a valid email format', async () => {
    const emailField = await waitForElement(By.css, newAccountPage.selectors.emailInput);

    await emailField.sendKeys(VALID_DATA.email);
    await driver.actions().sendKeys(Key.TAB).perform();
    await validateError(newAccountPage.selectors.usernameInput, ERROR_MESSAGES.username);
  });

  test('TC-012: Clicking Login link should redirect to login page', async () => {
    const LOGIN_LINK_SELECTOR = '/html/body/app-root/div/tenat-user-sign-up/app-authentication-layout/div/section[1]/p/a';
    const EXPECTED_URL = 'https://login.harmonychurchsuite.com/tenant/user-signin';
    const loginLink = await waitForElement(By.xpath, LOGIN_LINK_SELECTOR, TIMEOUTS.elementVisibility);

    await loginLink.click();
    await driver.wait(until.urlIs(EXPECTED_URL), TIMEOUTS.redirection);

    const actualResult = await driver.getCurrentUrl();
    const expectedResult = EXPECTED_URL;

    expect(actualResult).toBe(expectedResult);
  });
*/
});
