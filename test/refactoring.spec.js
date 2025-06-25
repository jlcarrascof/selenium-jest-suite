// test/userProfile.spec.js

const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until } = require('selenium-webdriver');

const CONFIG = {
  TIMEOUT: 120000,
  LOGIN_TIMEOUT: 8000,
  BASE_URL: 'https://login.harmonychurchsuite.com/tenant/user-signin?tenant=qa',
  EXPECTED_URL: 'https://qa.harmonychurchsuite.com/404',
  GROUPS_URL: 'https://qa.harmonychurchsuite.com/tenant/groups/index',
  USERNAME: 'javier',
  PASSWORD: '.qwerty123.',
  INVALID_USERNAME: 'invalidUser',
  INVALID_PASSWORD: 'invalidPass',
  CURRENT_BROWSER: 'chrome',
  DASHBOARD_TITLE_SELECTOR: 'h1.text-xl.font-semibold'
};

let driver;
let loginPage;
let profilePage;

const login = async (username, password) => {
  await loginPage.open();
  await loginPage.enterUsername(username);
  await loginPage.enterPassword(password);
  await loginPage.clickSubmit();
  await driver.wait(until.elementLocated(By.css(CONFIG.DASHBOARD_TITLE_SELECTOR)), CONFIG.TIMEOUT);
};

const expectRedirectTo = async (url) => {
  await driver.wait(until.urlIs(url), CONFIG.TIMEOUT);
  const actualUrl = await driver.getCurrentUrl();
  const expectedUrl = url;
  expect(actualUrl).toBe(expectedUrl);
};

beforeAll(async () => {
  const factory = new DriverFactory(CONFIG.CURRENT_BROWSER, CONFIG.TIMEOUT);
  driver = await factory.initDriver();
  loginPage = PageFactory.createPage('login', driver, CONFIG.BASE_URL, CONFIG.TIMEOUT);
  profilePage = PageFactory.createPage('profile', driver, CONFIG.BASE_URL, CONFIG.TIMEOUT);
});

afterAll(async () => {
  if (driver) await driver.quit();
});

describe('Test Suite: User Profile Functionality of Harmony Church', () => {
  test('TC-001: Valid credentials should login successfully', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const dashboardElement = await driver.findElement(By.css(CONFIG.DASHBOARD_TITLE_SELECTOR));
    const actualResult = await dashboardElement.getText();
    const expectedResult = /dashboard/i;
    expect(actualResult).toMatch(expectedResult);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-002: Invalid username should deny access', async () => {
    await loginPage.open();
    await loginPage.enterUsername(CONFIG.INVALID_USERNAME);
    await loginPage.enterPassword(CONFIG.PASSWORD);
    await loginPage.clickSubmit();
    const actualResult = await loginPage.getModalMessageText();
    const expectedResult = 'Invalid credentials.';
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-003: Invalid password should deny access', async () => {
    await loginPage.open();
    await loginPage.enterUsername(CONFIG.USERNAME);
    await loginPage.enterPassword(CONFIG.INVALID_PASSWORD);
    await loginPage.clickSubmit();
    const actualResult = await loginPage.getModalMessageText();
    const expectedResult = 'Invalid credentials.';
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-004: User profile icon should open menu', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickProfileIcon();
    const isVisible = await profilePage.isLogoutButtonVisible();
    expect(isVisible).toBe(true);
  });

  test('TC-005: Logout should terminate session successfully', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickProfileIcon();
    await profilePage.isLogoutButtonVisible();
    const actualResult = await profilePage.clickLogoutAndGetUrl();
    const expectedResult = CONFIG.BASE_URL;
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-006: Click on Apps button should open menu', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickAppsButton();
    const actualResult = await profilePage.isGroupsOptionVisible();
    const expectedResult = true;
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-007: Click on Groups should redirect to correct URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickAppsButton();
    await profilePage.isGroupsOptionVisible();
    const actualResult = await profilePage.clickGroupsAndGetUrl();
    const expectedResult = CONFIG.GROUPS_URL;
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-008: Click on My Profile should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const actualResult = await profilePage.clickMyProfileAndGetUrl();
    const expectedResult = CONFIG.EXPECTED_URL;
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-009: Click on Roles and Permissions should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const actualResult = await profilePage.clickRolesPermissionsAndGetUrl();
    const expectedResult = CONFIG.EXPECTED_URL;
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-010: Click on Users should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const actualResult = await profilePage.clickUsersAndGetUrl();
    const expectedResult = CONFIG.EXPECTED_URL;
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-011: Click on Event log should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const actualResult = await profilePage.clickEventLogAndGetUrl();
    const expectedResult = CONFIG.EXPECTED_URL;
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-012: Click on All notifications should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const actualResult = await profilePage.clickAllNotificationsAndGetUrl();
    const expectedResult = CONFIG.EXPECTED_URL;
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-013: Click on Role notifications should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const actualResult = await profilePage.clickRoleNotificationsAndGetUrl();
    const expectedResult = CONFIG.EXPECTED_URL;
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-014: Click on User notifications should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const actualResult = await profilePage.clickUserNotificationsAndGetUrl();
    const expectedResult = CONFIG.EXPECTED_URL;
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-015: Click on Languages should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const actualResult = await profilePage.clickLanguagesAndGetUrl();
    const expectedResult = CONFIG.EXPECTED_URL;
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-016: Click on Reference data should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const actualResult = await profilePage.clickReferenceDataAndGetUrl();
    const expectedResult = CONFIG.EXPECTED_URL;
    expect(actualResult).toBe(expectedResult);
  });

  test('TC-017: Click on Subscription data should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const actualResult = await profilePage.clickSubscriptionAndGetUrl();
    const expectedResult = CONFIG.EXPECTED_URL;
    expect(actualResult).toBe(expectedResult);
  });

});
