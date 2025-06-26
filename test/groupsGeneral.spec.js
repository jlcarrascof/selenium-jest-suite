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

  test('TC-002: Click on Reports should redirect to expected URL', async () => {
    await login();
    await profilePage.clickGroupsAndGetUrl();
    const actualUrl = await groupsPage.clickReportsAndGetUrl();
    expect(actualUrl).toBe(CONFIG.NOT_FOUND_URL);
  }, CONFIG.TIMEOUT);

  test('TC-003: Click on Calendar should redirect to expected URL', async () => {
    await login();
    await profilePage.clickGroupsAndGetUrl();
    const actualUrl = await groupsPage.clickCalendarAndGetUrl();
    expect(actualUrl).toBe(CONFIG.NOT_FOUND_URL);
  }, CONFIG.TIMEOUT);

  test('TC-004: Click on Resources should redirect to expected URL', async () => {
    await login();
    await profilePage.clickGroupsAndGetUrl();
    const actualUrl = await groupsPage.clickResourcesAndGetUrl();
    expect(actualUrl).toBe(CONFIG.NOT_FOUND_URL);
  }, CONFIG.TIMEOUT);

  test('TC-005: Click on User profile icon should open menu', async () => {
    await login();
    await groupsPage.clickProfileIcon();
    const isVisible = await groupsPage.isLogoutButtonVisible();
    expect(Boolean(isVisible)).toBe(true);
  }, CONFIG.TIMEOUT);

  test('TC-006: Click on My Profile should redirect to expected URL', async () => {
    await login();
    await profilePage.clickProfileIcon();
    const actualUrl = await profilePage.clickMyProfileAndGetUrl();
    expect(actualUrl).toBe(CONFIG.NOT_FOUND_URL);
  }, CONFIG.TIMEOUT);

  test('TC-007: Click on Log out should terminate session successfully', async () => {
    await login();
    await profilePage.clickProfileIcon();
    const actualUrl = await groupsPage.clickLogoutAndGetUrl();
    expect(actualUrl).toBe(CONFIG.BASE_URL);
  }, CONFIG.TIMEOUT);
});
