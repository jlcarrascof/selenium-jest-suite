const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until, Key } = require('selenium-webdriver');

const TIMEOUT = 120000;
const BASE_URL = 'https://login.harmonychurchsuite.com/tenant/user-signin?tenant=qa';
const VALID_USERNAME = 'javier';
const VALID_PASSWORD = '.qwerty123.';
const INVALID_USERNAME = 'invalidUser';
const INVALID_PASSWORD = 'invalidPass';
const CURRENT_BROWSER = 'chrome';
const DASHBOARD_TITLE_SELECTOR = 'h1.text-xl.font-semibold';

let driver;
let loginPage;
let profilePage;

beforeAll(async () => {
  const driverFactory = new DriverFactory(CURRENT_BROWSER, TIMEOUT);
  driver = await driverFactory.initDriver();
  loginPage = PageFactory.createPage('login', driver, BASE_URL, TIMEOUT);
  profilePage = PageFactory.createPage('profile', driver, BASE_URL, TIMEOUT);
});

afterAll(async () => {
  if (driver) {
    await driver.quit();
  }
});

describe('Test Suite: User Profile Functionality of Harmony Church', () => {
  test('TC-001: Valid credentials should login successfully', async () => {
    await loginPage.open();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();

    const dashboardElement = await driver.wait(
      until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)),
      TIMEOUT
    );
    const actualResult = await dashboardElement.getText();
    const expectedResult = /dashboard/i;

    expect(actualResult).toMatch(expectedResult);
  });

  test('TC-002: Invalid username should deny access', async () => {
    await loginPage.open();
    await loginPage.enterUsername(INVALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();

    const modalText = await loginPage.getModalMessageText();
    const expectedText = 'Invalid credentials.';

    expect(modalText).toBe(expectedText);
  });

  test('TC-003: Invalid password should deny access', async () => {
    await loginPage.open();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(INVALID_PASSWORD);
    await loginPage.clickSubmit();

    const modalText = await loginPage.getModalMessageText();
    const expectedText = 'Invalid credentials.';

    expect(modalText).toBe(expectedText);
  });

  test('TC-004: User profile icon should open menu', async () => {
    // Login first
    await loginPage.open();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();
    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    // Click on user profile icon to open menu
    await profilePage.clickProfileIcon();

    // Verify menu is open by checking the visibility of "Log out" button
    await profilePage.isLogoutButtonVisible();

  });

});
