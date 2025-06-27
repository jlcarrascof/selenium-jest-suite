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

    const expectedUrl = `${global.testConfig.baseUrl}/tenant/groups/index`;
    const actualUrl = await profilePage.clickGroupsAndGetUrl();

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test.each([
    ['TC-002', 'Click on Reports', 'reportsLink', 'groupsPage'],
    ['TC-003', 'Click on Calendar', 'calendarLink', 'groupsPage'],
    ['TC-004', 'Click on Resources', 'resourcesLink', 'groupsPage'],
    ['TC-006', 'Click on My Profile', 'myProfileLink', 'profilePage']
  ])('%s: %s should redirect to expected URL', async (_tc, desc, selectorKey, page) => {
    await login();

    if (page === 'groupsPage') {
      await profilePage.clickGroupsAndGetUrl();
    } else {
      await profilePage.clickProfileIcon();
    }

    const targetPage = page === 'groupsPage' ? groupsPage : profilePage;
    const actualUrl = await targetPage.clickElementAndGetUrl(selectorKey);
    const expectedUrl = CONFIG.NOT_FOUND_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-005: Click on User profile icon should open menu', async () => {
    await login();
    await groupsPage.clickProfileIcon();

    const actualResult = await groupsPage.isLogoutButtonVisible();
    const expectedResult = true;

    expect(Boolean(actualResult)).toBe(expectedResult);
  }, CONFIG.TIMEOUT);

  test('TC-007: Click on Log out should terminate session successfully', async () => {
    await login();
    await profilePage.clickProfileIcon();

    const actualUrl = await groupsPage.clickLogoutAndGetUrl(CONFIG.BASE_URL);
    const expectedUrl = CONFIG.BASE_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);
});
