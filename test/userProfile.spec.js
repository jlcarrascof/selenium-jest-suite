const { CONFIG, initPages } = require('./setup/userProfileTestSetup');
const { invalidCredentials } = require('./lib/testConfig');

let driver, loginPage, profilePage;

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

  beforeEach(async () => {
     await loginPage.open();
  });

  test('TC-001: Valid credentials should login successfully', async () => {
    await loginPage.login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const actualResult = await loginPage.getDashboardTitleText();
    const expectedResult = CONFIG.DASHBOARD_TITLE;

    expect(actualResult).toMatch(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-002: Invalid username should deny access', async () => {
    await loginPage.login(CONFIG.INVALID_USERNAME, CONFIG.PASSWORD);

    const actualResult = await loginPage.getModalText();
    const expectedResult = invalidCredentials;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-003: Invalid password should deny access', async () => {
    await loginPage.login(CONFIG.INVALID_USERNAME, CONFIG.INVALID_PASSWORD);

    const actualResult = await loginPage.getModalText();
    const expectedResult = invalidCredentials;

    expect(actualResult).toBe(expectedResult);

  }, CONFIG.TIMEOUT);

  test('TC-004: User profile icon should open menu', async () => {
    await loginPage.login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await loginPage.getDashboardTitleText();

    const actualResult = await profilePage.openUserMenu();
    const expectedResult = true;

    expect(actualResult).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-005: Logout should terminate session successfully', async () => {
    await loginPage.login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await loginPage.getDashboardTitleText();
    await profilePage.openUserMenu();

    const actualUrl = await profilePage.clickLogoutAndGetUrl();
    const expectedUrl = CONFIG.BASE_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-006: Clicking on the Apps button should display the main menu options', async () => {
    await loginPage.login(CONFIG.USERNAME, CONFIG.PASSWORD);
    const actualMenuState = await profilePage.openMainMenuAndSeeGroupsOption();
    const expectedMenuState = true;

    expect(actualMenuState).toBe(expectedMenuState);
  }, CONFIG.TIMEOUT);

/*
  test('TC-007: Click on Groups should redirect to Groups URL', async () => {

    await loginPage.login(CONFIG.USERNAME, CONFIG.PASSWORD);

    await profilePage.openMainMenu();
    await profilePage.seeGroupsOption();

    const actualUrl = await profilePage.clickGroupsAndGetUrl();
    const expectedUrl = CONFIG.GROUPS_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-008: Click on My Profile should redirect to My Profile URL', async () => {

    await loginPage.login(CONFIG.USERNAME, CONFIG.PASSWORD);

    await profilePage.clickProfileIcon();
    await profilePage.isLogoutButtonVisible();

    const actualUrl = await profilePage.clickMyProfileAndGetUrl();
    const expectedUrl = CONFIG.MYPROFILE_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test.each([
    ['TC-009', 'roles', 'Roles and Permissions', 'ROLES_PERMISSIONS_URL'],
    ['TC-010', 'users', 'Users', 'USERS_URL'],
    ['TC-011', 'eventLog', 'Event Log', 'EVENT_LOG_URL'],
    ['TC-012', 'allNotifications', 'All Notifications', 'ALL_NOTIFICATIONS_URL'],
    ['TC-013', 'roleNotifications', 'Role Notifications', 'ROLE_NOTIFICATIONS_URL'],
    ['TC-014', 'userNotifications', 'User Notifications', 'USER_NOTIFICATIONS_URL'],
    ['TC-015', 'languages', 'Languages', 'LANGUAGES_URL'],
    ['TC-016', 'referenceData', 'Reference Data', 'REFERENCE_DATA_URL'],
    ['TC-017', 'subscription', 'Subscription Data', 'SUBSCRIPTION_DATA_URL'],
  ])(
    '%s: Opening section "%s" redirects to %s URL',
    async (_tc, sectionKey, title,  expectedUrlKey) => {

      await loginPage.login(CONFIG.USERNAME, CONFIG.PASSWORD);

      const actualLink = await profilePage.openSectionAndGetUrl(sectionKey);
      const expectedLink = CONFIG[expectedUrlKey];

      expect(actualLink).toBe(expectedLink);
    }, CONFIG.TIMEOUT
  );
*/
});
