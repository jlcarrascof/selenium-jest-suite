const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until, Key } = require('selenium-webdriver');

const TIMEOUT = 120000;
const BASE_URL = 'https://login.harmonychurchsuite.com/tenant/user-signin?tenant=qa';
const GROUPS_URL = 'https://qa.harmonychurchsuite.com/tenant/groups/index';
const EXPECTED_URL = 'https://qa.harmonychurchsuite.com/404';
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
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

    const dashboardElement = await driver.wait(
      until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)),
      TIMEOUT
    );
    const actualResult = await dashboardElement.getText();
    const expectedResult = /dashboard/i;

    expect(actualResult).toMatch(expectedResult);
  });

  test('TC-002: Invalid username should deny access', async () => {
    await loginPage.login(INVALID_USERNAME, VALID_PASSWORD);

    const modalText = await loginPage.getModalMessageText();
    const expectedText = 'Invalid credentials.';

    expect(modalText).toBe(expectedText);
  });

  test('TC-003: Invalid password should deny access', async () => {
    await loginPage.login(VALID_USERNAME, INVALID_PASSWORD);

    const modalText = await loginPage.getModalMessageText();
    const expectedText = 'Invalid credentials.';

    expect(modalText).toBe(expectedText);
  });

  test('TC-004: User profile icon should open menu', async () => {
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    // Click on user profile icon to open menu
    await profilePage.clickProfileIcon();

    // Verify menu is open by checking the visibility of "Log out" button
    await profilePage.isLogoutButtonVisible();

  });

  test('TC-005: Logout should terminate session successfully', async () => {
    // Login first
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    // Open profile menu and logout
    await profilePage.clickProfileIcon();
    await profilePage.isLogoutButtonVisible();
    const actualUrl = await profilePage.clickLogoutAndGetUrl();
    const expectedUrl = BASE_URL;

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-006: Click on Apps button should open menu', async () => {
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    await profilePage.clickAppsButton();

    const isMenuOpen = await profilePage.isGroupsOptionVisible();

    expect(isMenuOpen).toBe(true);
  });

  test('TC-007: Click on Groups should redirect to correct URL', async () => {
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);
    await profilePage.clickAppsButton();
    await profilePage.isGroupsOptionVisible();

    const actualUrl = await profilePage.clickGroupsAndGetUrl();

    expect(actualUrl).toBe(GROUPS_URL);
  });

  test('TC-008: Click on My Profile should redirect to expected URL', async () => {
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    await profilePage.clickProfileIcon();
    await profilePage.isLogoutButtonVisible();

    const actualUrl = await profilePage.clickMyProfileAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

  test('TC-009: Click on Roles and Permissions should redirect to expected URL', async () => {

    await loginPage.open();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();
    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    const actualUrl = await profilePage.clickRolesPermissionsAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

  test('TC-010: Click on Users should redirect to expected URL', async () => {
    await loginPage.open();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();
    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    const actualUrl = await profilePage.clickUsersAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

  test('TC-011: Click on Event log should redirect to expected URL', async () => {
    await loginPage.open();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();
    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    const actualUrl = await profilePage.clickEventLogAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

  test('TC-012: Click on All notifications should redirect to expected URL', async () => {
    await loginPage.open();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();
    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    const actualUrl = await profilePage.clickAllNotificationsAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

  test('TC-013: Click on Role notifications should redirect to expected URL', async () => {
    await loginPage.open();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();
    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    const actualUrl = await profilePage.clickRoleNotificationsAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

  test('TC-014: Click on User notifications should redirect to expected URL', async () => {
    await loginPage.open();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();
    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    const actualUrl = await profilePage.clickUserNotificationsAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

  test('TC-015: Click on Languages should redirect to expected URL', async () => {
    await loginPage.open();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();
    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    const actualUrl = await profilePage.clickLanguagesAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

  test('TC-016: Click on Reference data should redirect to expected URL', async () => {
    await loginPage.open();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();
    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    const actualUrl = await profilePage.clickReferenceDataAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

  test('TC-017: Click on Subscription data should redirect to expected URL', async () => {
    await loginPage.open();
    await loginPage.enterUsername(VALID_USERNAME);
    await loginPage.enterPassword(VALID_PASSWORD);
    await loginPage.clickSubmit();
    await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);

    const actualUrl = await profilePage.clickSubscriptionAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

});
