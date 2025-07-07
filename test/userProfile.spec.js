const { CONFIG, initPages } = require('./setup/userProfileTestSetup');
const { By, until } = require('selenium-webdriver');

let driver, loginPage, profilePage;

const login = async (username, password) => {
  await loginPage.open();
  await loginPage.enterUsername(username);
  await loginPage.enterPassword(password);
  await loginPage.clickLoginButton();
  await driver.wait(until.elementLocated(By.css(CONFIG.DASHBOARD_TITLE_SELECTOR)), CONFIG.TIMEOUT);
};

beforeAll(async () => {
  const pages = await initPages();
  driver = pages.driver;
  loginPage = pages.loginPage;
  profilePage = pages.profilePage;
});

afterAll(async () => {
  if (driver) await driver.quit();
});

describe('Test Suite: User Profile Functionality of Harmony Church', () => {
  test('TC-001: Valid credentials should login successfully', async () => {
    await loginPage.loginWithValidCredentials(CONFIG.USERNAME, CONFIG.PASSWORD);

    const dashboardElement = await driver.findElement(By.css(CONFIG.DASHBOARD_TITLE_SELECTOR));
    const actualResult = await dashboardElement.getText();
    const expectedResult = /dashboard/i;

    expect(actualResult).toMatch(expectedResult);
  }, CONFIG.TIMEOUT);
/*
  test('TC-002: Invalid username should deny access', async () => {
    await loginPage.open();
    await loginPage.enterUsername(CONFIG.USERNAME);
    await loginPage.enterPassword(CONFIG.INVALID_PASSWORD);
    await loginPage.submitForm();

    const actualResult = await loginPage.getModalText();
    const expectedResult = CONFIG.INVALID_LOGIN_MESSAGE;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-003: Invalid password should deny access', async () => {
    await loginPage.open();
    await loginPage.enterUsername(CONFIG.USERNAME);
    await loginPage.enterPassword(CONFIG.INVALID_PASSWORD);
    await loginPage.submitForm();

    const actualResult = await loginPage.getModalText();
    const expectedResult = CONFIG.INVALID_LOGIN_MESSAGE;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-004: User profile icon should open menu', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickProfileIcon();

    const isVisible = await profilePage.isLogoutButtonVisible();

    expect(Boolean(isVisible)).toBe(true);
  }, CONFIG.TIMEOUT);

  test('TC-005: Logout should terminate session successfully', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickProfileIcon();
    await profilePage.isLogoutButtonVisible();

    const actualUrl = await profilePage.clickLogoutAndGetUrl();
    const expectedUrl = CONFIG.BASE_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-006: Click on Apps button should open menu', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickAppsButton();

    const isMenuOpen = await profilePage.isGroupsOptionVisible();

    expect(isMenuOpen).toBe(true);
  }, CONFIG.TIMEOUT);

  test('TC-007: Click on Groups should redirect to correct URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickAppsButton();
    await profilePage.isGroupsOptionVisible();

    const actualUrl = await profilePage.clickGroupsAndGetUrl();

    expect(actualUrl).toBe(CONFIG.GROUPS_URL);
  }, CONFIG.TIMEOUT);

  test('TC-008: Click on My Profile should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickProfileIcon();
    await profilePage.isLogoutButtonVisible();

    const actualUrl = await profilePage.clickMyProfileAndGetUrl();

    expect(actualUrl).toBe(CONFIG.MYPROFILE_URL);
  }, CONFIG.TIMEOUT);

  test('TC-009: Click on Roles and Permissions should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickRolesPermissionsAndGetUrl();

    expect(actualUrl).toBe(CONFIG.ROLES_PERMISSIONS_URL);
  }, CONFIG.TIMEOUT);

  test('TC-010: Click on Users should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickUsersAndGetUrl();

    expect(actualUrl).toBe(CONFIG.USERS_URL);
  }, CONFIG.TIMEOUT);

  test('TC-011: Click on Event log should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const actualUrl = await profilePage.clickEventLogAndGetUrl();
    expect(actualUrl).toBe(CONFIG.EVENT_LOG_URL);
  }, CONFIG.TIMEOUT);

  test('TC-012: Click on All notifications should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickAllNotificationsAndGetUrl();

    expect(actualUrl).toBe(CONFIG.ALL_NOTIFICATIONS_URL);
  }, CONFIG.TIMEOUT);

  test('TC-013: Click on Role notifications should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickRoleNotificationsAndGetUrl();

    expect(actualUrl).toBe(CONFIG.ROLE_NOTIFICATIONS_URL);
  }, CONFIG.TIMEOUT);

  test('TC-014: Click on User notifications should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickUserNotificationsAndGetUrl();

    expect(actualUrl).toBe(CONFIG.USER_NOTIFICATIONS_URL);
  }, CONFIG.TIMEOUT);

  test('TC-015: Click on Languages should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickLanguagesAndGetUrl();

    expect(actualUrl).toBe(CONFIG.LANGUAGES_URL);
  }, CONFIG.TIMEOUT);

  test('TC-016: Click on Reference data should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickReferenceDataAndGetUrl();

    expect(actualUrl).toBe(CONFIG.REFERENCE_DATA_URL);
  }, CONFIG.TIMEOUT);

  test('TC-017: Click on Subscription data should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickSubscriptionAndGetUrl();

    expect(actualUrl).toBe(CONFIG.SUBSCRIPTION_DATA_URL);
  }, CONFIG.TIMEOUT);
*/
});
