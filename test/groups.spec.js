const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until, Key } = require('selenium-webdriver');

const TIMEOUT = 120000;
const BASE_URL = 'https://login.harmonychurchsuite.com/tenant/user-signin?tenant=qa';
const GROUPS_URL = 'https://qa.harmonychurchsuite.com/tenant/groups/index';
const EXPECTED_URL = 'https://qa.harmonychurchsuite.com/404';
const VALID_USERNAME = 'javier';
const VALID_PASSWORD = '.qwerty123.';
// const INVALID_USERNAME = 'invalidUser';
// const INVALID_PASSWORD = 'invalidPass';
const CURRENT_BROWSER = 'chrome';
const DASHBOARD_TITLE_SELECTOR = 'h1.text-xl.font-semibold';

const loginAndGoToApps = async () => {
  await loginPage.open();
  await loginPage.enterUsername(VALID_USERNAME);
  await loginPage.enterPassword(VALID_PASSWORD);
  await loginPage.clickSubmit();
  await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);
  await profilePage.clickAppsButton();
  await profilePage.isGroupsOptionVisible();
};

let driver;
let loginPage, profilePage, groupsPage;

beforeAll(async () => {
  const driverFactory = new DriverFactory(CURRENT_BROWSER, TIMEOUT);
  driver = await driverFactory.initDriver();
  loginPage = PageFactory.createPage('login', driver, BASE_URL, TIMEOUT);
  profilePage = PageFactory.createPage('profile', driver, BASE_URL, TIMEOUT);
  groupsPage = PageFactory.createPage('groups', driver, BASE_URL, TIMEOUT);
});

afterAll(async () => {
  if (driver) {
    await driver.quit();
  }
});

describe('Test Suite: Groups Functionality of Harmony Church', () => {
  test('TC-001: Click on Groups should redirect to correct URL', async () => {
    await loginAndGoToApps();

    const actualUrl = await profilePage.clickGroupsAndGetUrl();

    expect(actualUrl).toBe(GROUPS_URL);
  });

  test('TC-002: Click on Reports should redirect to expected URL', async () => {
    await loginAndGoToApps();
    await profilePage.clickGroupsAndGetUrl();

    const actualUrl = await groupsPage.clickReportsAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

  test('TC-003: Click on Calendar should redirect to expected URL', async () => {
    await loginAndGoToApps();
    await profilePage.clickGroupsAndGetUrl();

    const actualUrl = await groupsPage.clickCalendarAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

  test('TC-004: Click on Resources should redirect to expected URL', async () => {
    await loginAndGoToApps();
    await profilePage.clickGroupsAndGetUrl();

    const actualUrl = await groupsPage.clickResourcesAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

  test('TC-005: Click on User profile icon should open menu', async () => {

    await loginAndGoToApps();
    await groupsPage.clickProfileIcon();
    await groupsPage.isLogoutButtonVisible();

  });

  test('TC-006: Click on My Profile should redirect to expected URL', async () => {
    await loginAndGoToApps();
    await profilePage.clickProfileIcon();
    await profilePage.isLogoutButtonVisible();

    const actualUrl = await profilePage.clickMyProfileAndGetUrl();

    expect(actualUrl).toBe(EXPECTED_URL);
  });

  test('TC-007: Click on Log out should terminate session successfully', async () => {
    await loginAndGoToApps();

    await profilePage.clickProfileIcon();
    await profilePage.isLogoutButtonVisible();

    const actualUrl = await groupsPage.clickLogoutAndGetUrl();
    const expectedUrl = BASE_URL;

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-008: Clicking on Create Group should display the group creation form', async () => {
    await loginAndGoToApps();

    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    const formTitle = await groupsPage.getGroupFormTitle();
    const expectedTitle = 'Create group'; 

    expect(formTitle).toBe(expectedTitle);
  });

});
