const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until, Key } = require('selenium-webdriver');

const TIMEOUT = 120000;
const BASE_URL = 'https://login.harmonychurchsuite.com/tenant/user-signin?tenant=qa';
const GROUPS_URL = 'https://qa.harmonychurchsuite.com/tenant/groups/index';
const NOT_FOUND_URL = 'https://qa.harmonychurchsuite.com/404';
const VALID_USERNAME = 'javier';
const VALID_PASSWORD = '.qwerty123.';
// const INVALID_USERNAME = 'invalidUser';
// const INVALID_PASSWORD = 'invalidPass';
const CURRENT_BROWSER = 'chrome';
const DASHBOARD_TITLE_SELECTOR = 'h1.text-xl.font-semibold';

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

const loginAndGoToApps = async () => {
  await loginPage.open();
  await loginPage.enterUsername(VALID_USERNAME);
  await loginPage.enterPassword(VALID_PASSWORD);
  await loginPage.clickSubmit();
  await driver.wait(until.elementLocated(By.css(DASHBOARD_TITLE_SELECTOR)), TIMEOUT);
  await profilePage.clickAppsButton();
};

describe('Test Suite: Groups Functionality of Harmony Church', () => {
  test('TC-001: Click on Groups should redirect to correct URL', async () => {
    await loginAndGoToApps();

    const actualUrl = await profilePage.clickGroupsAndGetUrl();
    const expectedUrl = GROUPS_URL;

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-002: Click on Reports should redirect to expected URL', async () => {
    await loginAndGoToApps();
    await profilePage.clickGroupsAndGetUrl();

    const actualUrl = await groupsPage.clickReportsAndGetUrl();
    const expectedUrl = NOT_FOUND_URL;

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-003: Click on Calendar should redirect to expected URL', async () => {
    await loginAndGoToApps();
    await profilePage.clickGroupsAndGetUrl();

    const actualUrl = await groupsPage.clickCalendarAndGetUrl();
    const expectedUrl = NOT_FOUND_URL;

    expect(actualUrl).toBe(expectedUrl););
  });

  test('TC-004: Click on Resources should redirect to expected URL', async () => {
    await loginAndGoToApps();
    await profilePage.clickGroupsAndGetUrl();

    const actualUrl = await groupsPage.clickResourcesAndGetUrl();
    const expectedUrl = NOT_FOUND_URL;

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-005: Click on User profile icon should open menu', async () => {

    await loginAndGoToApps();
    await groupsPage.clickProfileIcon();

    // Finish this test by checking if the profile icon menu is visible
    expect(true).toBe(false);

  });

  test('TC-006: Click on My Profile should redirect to expected URL', async () => {
    await loginAndGoToApps();
    await profilePage.clickProfileIcon();

    const actualUrl = await profilePage.clickMyProfileAndGetUrl();
    const expectedUrl = NOT_FOUND_URL;

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-007: Click on Log out should terminate session successfully', async () => {
    await loginAndGoToApps();

    await profilePage.clickProfileIcon();

    const actualUrl = await groupsPage.clickLogoutAndGetUrl();
    const expectedUrl = BASE_URL;

    expect(actualUrl).toBe(expectedUrl);
  });

  test('TC-008: Clicking on Create Group should display the group creation form', async () => {
    const TITLE_SELECTOR = 'Create Group';
    await loginAndGoToApps();

    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    const actualTitle = await groupsPage.getGroupFormTitle();
    const expectedTitle = TITLE_SELECTOR;

    expect(actualTitle).toBe(expectedTitle);
  });

  test('TC-009: Uploading a group image should display the selected image preview in the form', async () => {
    await loginAndGoToApps();

    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();
    await groupsPage.clickEditIconOnImage();
    await groupsPage.selectFirstImageFromGallery();
    await groupsPage.confirmImageSelection();

    const previewUrl = await groupsPage.getGroupImagePreviewSrc();

    const PREVIEW_URL_REGEX = /\/assets\/|\/d\/assets\//;
    const actualMatch = previewUrl.match(PREVIEW_URL_REGEX);
    const expectedMatch = true;

    expect(actualMatch).toBe(expectedMatch);
  });

  test('TC-010: Image is selected but Cancel is clicked, no image should be loaded', async () => {
    await loginAndGoToApps();

    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();
    await groupsPage.clickEditIconOnImage();
    await groupsPage.selectFirstImageFromGallery();
    await groupsPage.cancelImageSelection();

    const allowedTextVisible = await groupsPage.isImagePreviewEmpty();

    expect(allowedTextVisible).toBe(true);
  });

  test('TC-011: No image is selected and Cancel is clicked, no image should be loaded', async () => {
    await loginAndGoToApps();
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    await groupsPage.clickEditIconOnImage();
    await groupsPage.cancelImageSelection();

    const allowedTextVisible = await groupsPage.isImagePreviewEmpty();

    expect(allowedTextVisible).toBe(true);
  });

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


});
