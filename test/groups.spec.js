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

    const actualPreviewSrc = await groupsPage.getGroupImagePreviewSrc();
    const expecterdPattern = /\/assets\/|\/d\/assets\//;

    expect(actualPreviewSrc).toMatch(expecterdPattern);
  }, CONFIG.TIMEOUT);

  test('TC-010: Image is selected but Cancel is clicked, no image should be loaded', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();
    await groupsPage.clickEditIconOnImage();
    await groupsPage.selectFirstImageFromGallery();
    await groupsPage.cancelImageSelection();

    const actualIsImagePreviewEmpty = await groupsPage.isImagePreviewEmpty();
    const expectedIsImagePreviewEmpty = true;

    expect(actualIsImagePreviewEmpty).toBe(expectedIsImagePreviewEmpty);
  }, CONFIG.TIMEOUT);

  test('TC-011: No image is selected and Cancel is clicked, no image should be loaded', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    await groupsPage.clickEditIconOnImage();
    await groupsPage.cancelImageSelection();

    const actualIsImagePreviewEmpty = await groupsPage.isImagePreviewEmpty();
    const expectedIsImagePreviewEmpty = true;

    expect(actualIsImagePreviewEmpty).toBe(expectedIsImagePreviewEmpty);
  }, CONFIG.TIMEOUT);

  test('TC-012: Leaving the Name field empty should display validation error', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();
    await groupsPage.focusAndBlurNameInput();

    const actualIsNameRequiredMessageVisible = await groupsPage.isNameRequiredMessageVisible();
    const expectedIsNameRequiredMessageVisible = true;

    expect(actualIsNameRequiredMessageVisible).toBe(expectedIsNameRequiredMessageVisible);
  }, CONFIG.TIMEOUT);

  test('TC-013: Leaving the Purpose field empty should display validation error', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();
    await groupsPage.focusAndBlurPurposeInput();

    const actualIsPurposeRequiredMessageVisible = await groupsPage.isPurposeRequiredMessageVisible();
    const expectedIsPurposeRequiredMessageVisible = true;

    expect(actualIsPurposeRequiredMessageVisible).toBe(expectedIsPurposeRequiredMessageVisible);
  }, CONFIG.TIMEOUT);

  test('TC-014: Leaving the Location field empty should display validation error', async () => {
    await login(CONFIG.USERNAME, CONFIG.PASSWORD);
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    const actualErrorText = await groupsPage.focusAndBlurLocationInput();
    const expectedErrorText = 'Location is required';

    expect(actualErrorText).toBe(expectedErrorText);
  }, CONFIG.TIMEOUT);

});
