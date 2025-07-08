const { CONFIG, initPages } = require('./setup/userProfileTestSetup');
const { invalidCredentials } = require('./lib/testConfig');
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

    const actualResult = await loginPage.getDashboardTitleText();
    const expectedResult = CONFIG.DASHBOARD_TITLE;

    expect(actualResult).toMatch(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-002: Invalid username should deny access', async () => {
    await loginPage.open();
    await loginPage.enterUsername(CONFIG.INVALID_USERNAME);
    await loginPage.enterPassword(CONFIG.PASSWORD);
    await loginPage.clickLoginButton();

    const actualResult = await loginPage.getModalText();
    const expectedResult = invalidCredentials;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-003: Invalid password should deny access', async () => {
    await loginPage.open();
    await loginPage.enterUsername(CONFIG.USERNAME);
    await loginPage.enterPassword(CONFIG.INVALID_PASSWORD);
    await loginPage.clickLoginButton();

    const actualResult = await loginPage.getModalText();
    const expectedResult = invalidCredentials;

    expect(actualResult).toBe(expectedResult);

  }, CONFIG.TIMEOUT);

  test('TC-004: User profile icon should open menu', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickProfileIcon();

    const actualResult = await profilePage.isLogoutButtonVisible();
    const expectedResult = true;

    expect(Boolean(actualResult)).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-005: Logout should terminate session successfully', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickProfileIcon();
    await profilePage.isLogoutButtonVisible();

    const actualUrl = await profilePage.clickLogoutAndGetUrl();
    const expectedUrl = CONFIG.BASE_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-006: Clicking on the Apps button should display the main menu options', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    await profilePage.openMainMenu();

    const actualMenuState = await profilePage.seeGroupsOption();
    const expectedMenuState = true;

    expect(actualMenuState).toBe(expectedMenuState);
  }, CONFIG.TIMEOUT);


  test('TC-007: Click on Groups should redirect to Groups URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.openMainMenu();
    await profilePage.seeGroupsOption();

    const actualUrl = await profilePage.clickGroupsAndGetUrl();
    const expectedUrl = CONFIG.GROUPS_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-008: Click on My Profile should redirect to My Profile URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickProfileIcon();
    await profilePage.isLogoutButtonVisible();

    const actualUrl = await profilePage.clickMyProfileAndGetUrl();
    const expectedUrl = CONFIG.MYPROFILE_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

/*
  test.each([
    ['TC-009', 'roles',            'ROLES_PERMISSIONS_URL'],
    ['TC-010', 'users',            'USERS_URL'],
    ['TC-011', 'eventLog',         'EVENT_LOG_URL'],
    ['TC-012', 'allNotifications', 'ALL_NOTIFICATIONS_URL'],
    ['TC-013', 'roleNotifications','ROLE_NOTIFICATIONS_URL'],
    ['TC-014', 'userNotifications','USER_NOTIFICATIONS_URL'],
    ['TC-015', 'languages',        'LANGUAGES_URL'],
    ['TC-016', 'referenceData',    'REFERENCE_DATA_URL'],
    ['TC-017', 'subscription',     'SUBSCRIPTION_DATA_URL'],
  ])(
    '%s: opening section "%s" redirects to the expected URL',
    async (_tc, sectionKey, expectedUrlKey) => {
      await login(CONFIG.USERNAME, CONFIG.PASSWORD);

      const actualLink = await profilePage.openSectionAndGetUrl(sectionKey);
      const expectedLink = CONFIG[expectedUrlKey];

      expect(actualLink).toBe(expectedLink);
    }, CONFIG.TIMEOUT
  );
*/
/*
  test('TC-009: Click on Roles and Permissions should redirect to Roles and Permissions URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickRolesPermissionsAndGetUrl();
    const expectedUrl = CONFIG.ROLES_PERMISSIONS_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-010: Click on Users should redirect to Users URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickUsersAndGetUrl();
    const expectedUrl = CONFIG.USERS_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-011: Click on Event log should redirect to Event log URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickEventLogAndGetUrl();
    const expectedUrl = CONFIG.EVENT_LOG_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-012: Click on All notifications should redirect to All notifications URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickAllNotificationsAndGetUrl();
    const expectedUrl = CONFIG.ALL_NOTIFICATIONS_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-013: Click on Role notifications should redirect to Role notifications URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickRoleNotificationsAndGetUrl();
    const expectedUrl = CONFIG.ROLE_NOTIFICATIONS_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-014: Click on User notifications should redirect to User notifications URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickUserNotificationsAndGetUrl();
    const expectedUrl = CONFIG.USER_NOTIFICATIONS_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-015: Click on Languages should redirect to Languages URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickLanguagesAndGetUrl();
    const expectedUrl = CONFIG.LANGUAGES_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-016: Click on Reference data should redirect to Reference data URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickReferenceDataAndGetUrl();
    const expectedUrl = CONFIG.REFERENCE_DATA_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-017: Click on Subscription data should redirect to Subscription data URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualUrl = await profilePage.clickSubscriptionAndGetUrl();
    const expectedUrl = CONFIG.SUBSCRIPTION_DATA_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);
*/

});
