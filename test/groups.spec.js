const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until, Key } = require('selenium-webdriver');

const CONFIG = {
  TIMEOUT: 30000,
  USERNAME: 'javier',
  PASSWORD: '.qwerty123.',
  DASHBOARD_TITLE_SELECTOR: 'h1.text-xl.font-semibold',
  BASE_URL: 'https://login.harmonychurchsuite.com/tenant/user-signin?tenant=qa',
  NOT_FOUND_URL: 'https://qa.harmonychurchsuite.com/404',
}

let driver;
let loginPage, profilePage, groupsPage;

beforeAll(async () => {
  const driverFactory = new DriverFactory(global.testConfig.currentBrowser, global.testConfig.timeout);

  driver = await driverFactory.initDriver();

  loginPage = PageFactory.createPage('login', driver, `${global.testConfig.baseLoginUrl}`, global.testConfig.timeout);
  profilePage = PageFactory.createPage('profile', driver, CONFIG.BASE_URL, global.testConfig.timeout);
  groupsPage = PageFactory.createPage('groups', driver, global.testConfig.baseUrl, global.testConfig.timeout);
});

afterAll(async () => {
  if (driver) await driver.quit();
});

const login = async (username, password) => {
  await loginPage.open();
  await loginPage.enterUsername(username);
  await loginPage.enterPassword(password);
  await loginPage.clickSubmit();
  await driver.wait(until.elementLocated(By.css(CONFIG.DASHBOARD_TITLE_SELECTOR)), CONFIG.TIMEOUT);
  await profilePage.clickAppsButton();
};

describe('Test Suite: Groups Functionality of Harmony Church', () => {
  test('TC-001: Click on Groups should redirect to correct URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);

    const GROUPS_URL = `${global.testConfig.baseUrl}/tenant/groups/index`;

    const actualUrl = await profilePage.clickGroupsAndGetUrl();
    const expectedUrl = GROUPS_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-002: Click on Reports should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickGroupsAndGetUrl();

    const actualUrl = await groupsPage.clickReportsAndGetUrl();
    const expectedUrl = CONFIG.NOT_FOUND_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-003: Click on Calendar should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickGroupsAndGetUrl();

    const actualUrl = await groupsPage.clickCalendarAndGetUrl();
    const expectedUrl = CONFIG.NOT_FOUND_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-004: Click on Resources should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickGroupsAndGetUrl();

    const actualUrl = await groupsPage.clickResourcesAndGetUrl();
    const expectedUrl = CONFIG.NOT_FOUND_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-005: Click on User profile icon should open menu', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await groupsPage.clickProfileIcon();
    await groupsPage.isLogoutButtonVisible();
  }, CONFIG.TIMEOUT);

  test('TC-006: Click on My Profile should redirect to expected URL', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickProfileIcon();

    const actualUrl = await profilePage.clickMyProfileAndGetUrl();
    const expectedUrl = CONFIG.NOT_FOUND_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-007: Click on Log out should terminate session successfully', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickProfileIcon();

    const actualUrl = await groupsPage.clickLogoutAndGetUrl();
    const expectedUrl = CONFIG.BASE_URL;

    expect(actualUrl).toBe(expectedUrl);
  }, CONFIG.TIMEOUT);

  test('TC-008: Clicking on Create Group should display the group creation form', async () => {
    const TITLE_SELECTOR = 'Create Group';

    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    const actualTitle = await groupsPage.getGroupFormTitle();
    const expectedTitle = TITLE_SELECTOR;

    expect(actualTitle).toBe(expectedTitle);
  }, CONFIG.TIMEOUT);

  test('TC-009: Uploading a group image should display the selected image preview in the form', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    await groupsPage.clickEditIconOnImage();
    await groupsPage.selectFirstImageFromGallery();
    await groupsPage.confirmImageSelection();

    const previewSrc = await groupsPage.getGroupImagePreviewSrc();

    expect(previewSrc).toMatch(/\/assets\/|\/d\/assets\//);
  }, CONFIG.TIMEOUT);

  test('TC-010: Image is selected but Cancel is clicked, no image should be loaded', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();
    await groupsPage.clickEditIconOnImage();
    await groupsPage.selectFirstImageFromGallery();
    await groupsPage.cancelImageSelection();

    const allowedTextVisible = await groupsPage.isImagePreviewEmpty();

    expect(allowedTextVisible).toBe(true);
  }, CONFIG.TIMEOUT);

/*
  test('TC-011: No image is selected and Cancel is clicked, no image should be loaded', async () => {
    await login(VALID_USERNAME, VALID_PASSWORD);
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    await groupsPage.clickEditIconOnImage();
    await groupsPage.cancelImageSelection();

    const allowedTextVisible = await groupsPage.isImagePreviewEmpty();

    expect(allowedTextVisible).toBe(true);
  }, TIMEOUT);
*/
/*
  test('TC-012: Leaving the Name field empty should display validation error', async () => {
    await loginAndGoToApps();
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();
    await groupsPage.focusAndBlurNameInput();

    const visible = await groupsPage.isNameRequiredMessageVisible();

    expect(visible).toBe(true);
  });

  test('TC-013: Leaving the Purpose field empty should display validation error', async () => {
    await loginAndGoToApps();
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    await groupsPage.focusAndBlurPurposeInput();
    const visible = await groupsPage.isPurposeRequiredMessageVisible();

    expect(visible).toBe(true);
  });

  test('TC-014: Leaving the Location field empty should display validation error', async () => {
    await loginAndGoToApps();
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    const errorText = await groupsPage.focusAndBlurLocationInput();
    expect(errorText).toBe('Location is required');
  });
*/

});
