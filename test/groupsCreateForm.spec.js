const {
  CONFIG,
  initPages,
  login
} = require('./helpers/groupsTestSetup');

let driver, profilePage, groupsPage;

beforeAll(async () => {
  const pages = await initPages();
  driver = pages.driver;
  profilePage = pages.profilePage;
  groupsPage = pages.groupsPage;
});

afterAll(async () => {
  if (driver) await driver.quit();
});

describe('Groups - Create Form Functionality', () => {
  test('TC-008: Clicking on Create Group should display the group creation form', async () => {
    await login();
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    const actualTitle = await groupsPage.getGroupFormTitle();
    expect(actualTitle).toBe('Create Group');
  }, CONFIG.TIMEOUT);

  test('TC-009: Uploading a group image should display the selected image preview in the form', async () => {
    await login();
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    await groupsPage.clickEditIconOnImage();
    await groupsPage.selectFirstImageFromGallery();
    await groupsPage.confirmImageSelection();

    const actualPreviewSrc = await groupsPage.getGroupImagePreviewSrc();
    expect(actualPreviewSrc).toMatch(/\/assets\/|\/d\/assets\//);
  }, CONFIG.TIMEOUT);

  test('TC-010: Image is selected but Cancel is clicked, no image should be loaded', async () => {
    await login();
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();
    await groupsPage.clickEditIconOnImage();
    await groupsPage.selectFirstImageFromGallery();
    await groupsPage.cancelImageSelection();

    const result = await groupsPage.isImagePreviewEmpty();
    expect(result).toBe(true);
  }, CONFIG.TIMEOUT);

  test('TC-011: No image is selected and Cancel is clicked, no image should be loaded', async () => {
    await login();
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();
    await groupsPage.clickEditIconOnImage();
    await groupsPage.cancelImageSelection();

    const result = await groupsPage.isImagePreviewEmpty();
    expect(result).toBe(true);
  }, CONFIG.TIMEOUT);

  test.each([
    ['TC-012', 'Name', 'focusAndBlurNameInput', 'isNameRequiredMessageVisible', true],
    ['TC-013', 'Purpose', 'focusAndBlurPurposeInput', 'isPurposeRequiredMessageVisible', true]
    ['TC-015', 'Meeting Date', 'focusAndBlurMeetingDateInput', 'isMeetingDateRequiredMessageVisible', true]
  ])('%s: Leaving the %s field empty should display validation error', async (_tc, label, focusMethod, validateMethod, expected) => {
    await login();
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    await groupsPage[focusMethod]();
    const result = await groupsPage[validateMethod]();

    expect(result).toBe(expected);
  }, CONFIG.TIMEOUT);

  test('TC-014: Leaving the Location field empty should display validation error', async () => {
    await login();
    await profilePage.clickGroupsAndGetUrl();
    await groupsPage.clickCreateGroup();

    const errorText = await groupsPage.focusAndBlurLocationInput();
    expect(errorText).toBe('Location is required');
  }, CONFIG.TIMEOUT);
});
