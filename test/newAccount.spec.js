// test/NewAccount.spec.js
const { By, until, Key } = require('selenium-webdriver');
const { CONFIG, initPages, driver: getDriver, newAccountPage: getNewAccountPage } = require('./setup/newAccountTestSetup');

let driver, newAccountPage;

const waitForElement = async (by, selector, timeout = newAccountPage.timeout) => {
  const element = await driver.findElement(by(selector));

  await driver.wait(until.elementIsVisible(element), timeout);

  return element;
};

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

  test('TC-009: Confirm Password field should display error message when we type a different Password', async () => {
    await newAccountPage.fillPasswordAndConfirmation(
      CONFIG.VALID_DATA.password, CONFIG.VALID_DATA.differentPassword
    );

    const actualResult = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.confirmPasswordInput, CONFIG.ERROR_MESSAGES.confirmPassword
    );
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-010: Email field should display error message when using an invalid email format', async () => {
    await newAccountPage.fillTextField(
      newAccountPage.selectors.emailInput,
      CONFIG.INVALID_EMAILS.incomplete
    );

    const actualResult = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.emailInput,
      CONFIG.ERROR_MESSAGES.invalidEmail
    );
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-011: Email field should not display error message when using a valid email format', async () => {
    await newAccountPage.enterEmail(CONFIG.VALID_DATA.email);
    await newAccountPage.leaveEmailField();
    const actualResult = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.emailInput,
      '',
      false
    );
    const expectedResult = true;
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-012: Clicking Login link should redirect to login page', async () => {
    await newAccountPage.clickLoginLink();

    const expectedUrl = CONFIG.LOGIN_PAGE_URL;

    await newAccountPage.waitForUrl(expectedUrl);

    const actualUrl = await newAccountPage.getCurrentUrl();
    const expectedResult = expectedUrl;

    expect(actualUrl).toBe(expectedResult);
  });

});
