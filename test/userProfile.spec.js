const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until, Key } = require('selenium-webdriver');

const CONFIG = {
  LOGIN_TIMEOUT: 15000,
  BASE_URL: 'https://login.harmonychurchsuite.com/tenant/user-signin?tenant=qa',
  EXPECTED_URL: 'https://qa.harmonychurchsuite.com/404',
  GROUPS_URL: 'https://qa.harmonychurchsuite.com/tenant/groups/index',
  USERNAME: 'javier',
  PASSWORD: '.qwerty123.',
  INVALID_USERNAME: 'invalidUser',
  INVALID_PASSWORD: 'invalidPass',
  DASHBOARD_TITLE_SELECTOR: 'h1.text-xl.font-semibold',
  INVALID_LOGIN_MESSAGE: 'Invalid credentials.',
};

let driver;
let loginPage;
let profilePage;

const login = async (username, password) => {
  await loginPage.open();
  await loginPage.enterUsername(username);
  await loginPage.enterPassword(password);
  await loginPage.clickSubmit();
  await driver.wait(until.elementLocated(By.css(CONFIG.DASHBOARD_TITLE_SELECTOR)), CONFIG.LOGIN_TIMEOUT);
};

/* Testing redirect functionality is commented
const expectRedirectTo = async (url) => {
  await driver.wait(until.urlIs(url), CONFIG.TIMEOUT);
  const actualUrl = await driver.getCurrentUrl();
  const expectedUrl = url;
  expect(actualUrl).toBe(expectedUrl);
};
*/

beforeAll(async () => {
  const driverFactory = new DriverFactory(global.testConfig.currentBrowser, global.testConfig.timeout);
  driver = await driverFactory.initDriver();
  loginPage = PageFactory.createPage('login', driver, CONFIG.BASE_URL, global.testConfig.timeout);
  profilePage = PageFactory.createPage('profile', driver, CONFIG.BASE_URL, global.testConfig.timeout);
});

afterAll(async () => {
  if (driver) {
    await driver.quit();
  }
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
    const expectedResult = CONFIG.INVALID_LOGIN_MESSAGE;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-003: Invalid password should deny access', async () => {
    await loginPage.open();
    await loginPage.enterUsername(CONFIG.USERNAME);
    await loginPage.enterPassword(CONFIG.INVALID_PASSWORD);
    await loginPage.clickSubmit();

    const actualResult = await loginPage.getModalMessageText();
    const expectedResult = CONFIG.INVALID_LOGIN_MESSAGE;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-004: User profile icon should open menu', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickProfileIcon();

    const isVisible = await profilePage.isLogoutButtonVisible();

    expect(Boolean(isVisible)).toBe(true);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-005: Logout should terminate session successfully', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickProfileIcon();
    await profilePage.isLogoutButtonVisible();

    const actualUrl = await profilePage.clickLogoutAndGetUrl();
    const expectedUrl = CONFIG.BASE_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-006: Click on Apps button should open menu', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickAppsButton();

    const isMenuOpen = await profilePage.isGroupsOptionVisible();

    expect(isMenuOpen).toBe(true);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-007: Click on Groups should redirect to correct URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickAppsButton();
    await profilePage.isGroupsOptionVisible();

    const actualUrl = await profilePage.clickGroupsAndGetUrl();

    expect(actualUrl).toBe(CONFIG.GROUPS_URL);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-008: Click on My Profile should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickProfileIcon();
    await profilePage.isLogoutButtonVisible();

    const actualUrl = await profilePage.clickMyProfileAndGetUrl();

    expect(actualUrl).toBe(CONFIG.EXPECTED_URL);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-009: Click on Roles and Permissions should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickRolesPermissionsAndGetUrl();

    expect(actualUrl).toBe(CONFIG.EXPECTED_URL);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-010: Click on Users should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickUsersAndGetUrl();

    expect(actualUrl).toBe(CONFIG.EXPECTED_URL);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-011: Click on Event log should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const actualUrl = await profilePage.clickEventLogAndGetUrl();
    expect(actualUrl).toBe(CONFIG.EXPECTED_URL);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-012: Click on All notifications should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickAllNotificationsAndGetUrl();

    expect(actualUrl).toBe(CONFIG.EXPECTED_URL);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-013: Click on Role notifications should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickRoleNotificationsAndGetUrl();

    expect(actualUrl).toBe(CONFIG.EXPECTED_URL);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-014: Click on User notifications should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickUserNotificationsAndGetUrl();

    expect(actualUrl).toBe(CONFIG.EXPECTED_URL);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-015: Click on Languages should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickLanguagesAndGetUrl();

    expect(actualUrl).toBe(CONFIG.EXPECTED_URL);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-016: Click on Reference data should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickReferenceDataAndGetUrl();

    expect(actualUrl).toBe(CONFIG.EXPECTED_URL);
  }, CONFIG.LOGIN_TIMEOUT);

  test('TC-017: Click on Subscription data should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickSubscriptionAndGetUrl();

    expect(actualUrl).toBe(CONFIG.EXPECTED_URL);
  }, CONFIG.LOGIN_TIMEOUT);
});
