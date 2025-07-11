const { CONFIG, initPages, login } = require('./setup/groupsTestSetup');

let driver;
let profilePage;
let groupsPage;

beforeAll(async () => {
  const pages = await initPages();
  driver = pages.driver;
  profilePage = pages.profilePage;
  groupsPage = pages.groupsPage;
  loginPage = pages.loginPage;
});

beforeEach(async () => {
  await loginPage.open();
});


afterAll(async () => {
  if (driver) await driver.quit();
});

describe('Groups - General Functionality', () => {
  test('TC-001: Click on Groups should redirect to Groups URL', async () => {
    await loginPage.login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.openMainMenuAndSeeGroupsOption();

    const actualUrl = await profilePage.clickGroupsAndGetUrl();
    const expectedUrl = CONFIG.GROUPS_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test.each([
    ['TC-002', 'Click on Reports', 'Reports', 'reportsLink', 'groupsPage'],
    ['TC-003', 'Click on Calendar', 'Calendar', 'calendarLink', 'groupsPage'],
    ['TC-004', 'Click on Resources', 'Resources', 'resourcesLink', 'groupsPage'],
    ['TC-005', 'Click on My Profile', 'My Profile', 'myProfileLink', 'profilePage']
  ])('%s: %s should redirect to %s URL', async (_tc, desc, kind, selectorKey, page) => {
    await loginPage.login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await loginPage.getDashboardTitleText();

    if (page === 'groupsPage') {
      await profilePage.clickGroupsAndGetUrl();
    } else {
      await profilePage.openUserMenu();
    }

    const targetPage = page === 'groupsPage' ? groupsPage : profilePage;
    const actualUrl = await targetPage.clickElementAndGetUrl(selectorKey);
    const expectedUrl = CONFIG.NOT_FOUND_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);
/*
  test('TC-006: Click on User profile icon should open menu', async () => {
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
*/
});
