const {
  CONFIG,
  initPages,
  login,
  driver: getDriver
} = require('./helpers/groupsTestSetup');

let driver;
let profilePage;
let groupsPage;

beforeAll(async () => {
  const pages = await initPages();
  driver = pages.driver;
  profilePage = pages.profilePage;
  groupsPage = pages.groupsPage;
});

afterAll(async () => {
  if (driver) await driver.quit();
});

describe('Groups - General Functionality', () => {
  test('TC-001: Click on Groups should redirect to correct URL', async () => {
    await login();

    const GROUPS_URL = `${global.testConfig.baseUrl}/tenant/groups/index`;
    const actualUrl = await profilePage.clickGroupsAndGetUrl();

    expect(actualUrl).toBe(GROUPS_URL);
  }, CONFIG.TIMEOUT);

  test.each([
    ['TC-002', 'clickReportsAndGetUrl'],
    ['TC-003', 'clickCalendarAndGetUrl'],
    ['TC-004', 'clickResourcesAndGetUrl'],
    ['TC-006', 'clickMyProfileAndGetUrl', 'profilePage']
  ])('%s: Should redirect to expected 404 URL', async (_tc, method, page = 'groupsPage') => {
    await login();

    if (page === 'groupsPage') {
      await profilePage.clickGroupsAndGetUrl();
    } else {
      await profilePage.clickProfileIcon();
    }

    const actualUrl = await (
      page === 'groupsPage' ? groupsPage[method]() : profilePage[method]()
    );

    expect(actualUrl).toBe(CONFIG.NOT_FOUND_URL);
  }, CONFIG.TIMEOUT);

  test('TC-005: Click on User profile icon should open menu', async () => {
    await login();
    await groupsPage.clickProfileIcon();

    const isVisible = await groupsPage.isLogoutButtonVisible();

    expect(Boolean(isVisible)).toBe(true);
  }, CONFIG.TIMEOUT);

  test('TC-007: Click on Log out should terminate session successfully', async () => {
    await login();
    await profilePage.clickProfileIcon();

    const actualUrl = await groupsPage.clickLogoutAndGetUrl();

    expect(actualUrl).toBe(CONFIG.BASE_URL);
  }, CONFIG.TIMEOUT);
});
