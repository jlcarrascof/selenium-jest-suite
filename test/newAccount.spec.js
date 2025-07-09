const { CONFIG, initPages } = require('./setup/newAccountTestSetup');

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
/*
  test('TC-001: Terms and Conditions checkbox should display error message when unchecked', async () => {
    await newAccountPage.submitWithoutTerms();

    const actualResult = await newAccountPage.hasTermsError();
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test.each([
    ['TC-002', 'Name', 'nameInput',   CONFIG.ERROR_MESSAGES.name],
    ['TC-003', 'Surname', 'surnameInput', CONFIG.ERROR_MESSAGES.surname],
    ['TC-004', 'Email',   'emailInput',   CONFIG.ERROR_MESSAGES.email],
    ['TC-005', 'Username', 'usernameInput', CONFIG.ERROR_MESSAGES.username],
    ['TC-006', 'Password', 'passwordInput', CONFIG.ERROR_MESSAGES.password],
  ])(
    '%s: %s field should display error when empty',
      async (tc, description,  fieldKey, expectedMessage) => {
      const actualResult = await newAccountPage.requiredErrorVisible(
        fieldKey,
        expectedMessage
      );
      const expectedResult = true;

      expect(actualResult).toBe(expectedResult);
    }
  , CONFIG.TIMEOUT);

  test.each([
    {
      tc: 'TC-007',
      description: 'Create Account button should be disabled when fields are empty and Terms & Conditions checkbox is unchecked',
      fillFields: false,
      acceptTerms: false,
      expectedResult: false
    },
    {
      tc: 'TC-008',
      description: 'Create Account button should be enabled when all fields are valid and Terms & Conditions checkbox is checked',
      fillFields: true,
      acceptTerms: true,
      expectedResult: true
    },
    {
      tc: 'TC-009',
      description: 'Create Account button should be disabled when all fields are valid but Terms & Conditions checkbox is unchecked',
      fillFields: true,
      acceptTerms: false,
      expectedResult: false
    }
  ])('$tc: $description', async ({ fillFields, acceptTerms, expectedResult }) => {
    if (fillFields) {
      await newAccountPage.fillOutAllFieldsWithValidData(CONFIG.VALID_DATA);
    }

    await newAccountPage.setTermsAndConditions(acceptTerms);

    const actualResult = await newAccountPage.isCreateAccountButtonEnabled();
    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test.each([
    ['TC-010', 'only numbers', CONFIG.INVALID_PASSWORDS.onlyNumbers, CONFIG.ERROR_MESSAGES.password],
    ['TC-011', 'only letters', CONFIG.INVALID_PASSWORDS.onlyLetters, CONFIG.ERROR_MESSAGES.password],
    ['TC-012', 'short length (< 8 chars)', CONFIG.INVALID_PASSWORDS.shortLength, CONFIG.ERROR_MESSAGES.password],
  ])('%s: Password field should display error message when using %s', async (tc, desc, inputPassword, expectedMessage) => {
    const actualResult = await newAccountPage.showsPasswordRequiredError(inputPassword, expectedMessage);
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-013: Confirm Password field should display error message when we type a different Password', async () => {

    await newAccountPage.enterPasswordAndConfirmation(CONFIG.VALID_DATA.password, CONFIG.VALID_DATA.differentPassword);

    const actualResult = await newAccountPage.isConfirmPasswordShowingMessageWhenBlur(CONFIG.ERROR_MESSAGES.confirmPassword);

    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });
*/
  test('TC-014: Email field should display error message when using an invalid email format', async () => {

     await newAccountPage.enterEmail(CONFIG.INVALID_EMAILS.incomplete);

    const actualResult = await newAccountPage.isInvalidEmailShowingMessageWhenBlur(CONFIG.INVALID_EMAILS.incomplete, CONFIG.ERROR_MESSAGES.invalidEmail);

    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });
/*
  test('TC-015: Email field should not display error message when using a valid email format', async () => {

    await newAccountPage.enterEmail(CONFIG.VALID_DATA.email);

    const actualResult = await newAccountPage.isValidEmailNotShowingMessageWhenBlur();

    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  });

  test('TC-016: Clicking Login link should redirect to login page', async () => {
    await newAccountPage.clickLoginLink();

    const expectedUrl = CONFIG.LOGIN_PAGE_URL;

    await newAccountPage.waitForUrl(expectedUrl);

    const actualUrl = await newAccountPage.getCurrentUrl();
    const expectedResult = expectedUrl;

    expect(actualUrl).toBe(expectedResult);
  });
*/
});
