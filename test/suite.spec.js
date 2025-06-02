
const { Builder } = require('selenium-webdriver');
const PageFactory = require('../factories/PageFactory');
const { getValidCredentials, getInvalidCredentials } = require('../data/credentials');
const { checkTabOrder } = require('../utils/accessibility');
const { logStep } = require('../utils/testLogger');

let driver;
let landingPage, loginPage;

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
  landingPage = PageFactory.getLandingPage(driver);
  loginPage = PageFactory.getLoginPage(driver);
});

afterAll(async () => {
  await driver.quit();
});

describe('🧪 Login Flow - Harmony Church', () => {

  test('🔐 Successful login redirects to dashboard', async () => {
    const { email, password } = getValidCredentials();
    await landingPage.goToLogin();
    await loginPage.loginWith(email, password);
    expect(await loginPage.isRedirectedToDashboard()).toBe(true);
  });

  test('❌ Login fails with wrong password', async () => {
    const { email } = getValidCredentials();
    const { password: wrongPassword } = getInvalidCredentials();
    await landingPage.goToLogin();
    await loginPage.loginWith(email, wrongPassword);
    expect(await loginPage.getErrorMessage()).toContain('Invalid credentials');
  });

  test('⚠️ Login form shows validation errors', async () => {
    await landingPage.goToLogin();
    await loginPage.submitEmptyForm();
    expect(await loginPage.getEmailValidationMessage()).toContain('required');
    expect(await loginPage.getPasswordValidationMessage()).toContain('required');
  });

  test('🔘 Login button is disabled until fields are filled', async () => {
    await landingPage.goToLogin();
    expect(await loginPage.isLoginButtonEnabled()).toBe(false);
    await loginPage.fillEmail('user@example.com');
    await loginPage.fillPassword('secret123');
    expect(await loginPage.isLoginButtonEnabled()).toBe(true);
  });

  test('⌨️ Tab navigation order is correct', async () => {
    await landingPage.goToLogin();
    const tabOrder = await checkTabOrder(driver, [
      loginPage.selectors.emailInput,
      loginPage.selectors.passwordInput,
      loginPage.selectors.rememberMeCheckbox,
      loginPage.selectors.loginButton,
    ]);
    expect(tabOrder).toBe(true);
  });

  test('🔗 Forgot password link navigates correctly', async () => {
    await landingPage.goToLogin();
    await loginPage.clickForgotPassword();
    expect(await loginPage.isOnForgotPasswordPage()).toBe(true);
  });
});
