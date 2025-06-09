const DriverFactory = require('./factories/driverFactory');
const PageFactory = require('./factories/pagesFactory');
const { By, until, Key } = require('selenium-webdriver');

const TIMEOUT = 120000;
const BASE_URL = 'https://login.harmonychurchsuite.com/tenant/user-signup?tenant=qa';

let driver;
let newAccountPage;

beforeAll(async () => {
  const driverFactory = new DriverFactory(CURRENT_BROWSER, TIMEOUT);
  driver = await driverFactory.initDriver();
  newAccountPage = PageFactory.createPage('newAccount', driver, BASE_URL, TIMEOUT);
});

afterAll(async () => {
  if (driver) await driver.quit();
});

describe('Test Suite: New Account Functionality of Harmony Church', () => {
  test('TC-001: Name field should display error message when empty', async () => {
    await newAccountPage.open();
    const nameField = await driver.findElement(By.css(newAccountPage.selectors.nameInput));
    await nameField.click();

    const result = await newAccountPage.verifyBlurValidation(
      newAccountPage.selectors.nameInput,
      'Enter your name'
    );

    expect(result).toBe(true);
  });
});
