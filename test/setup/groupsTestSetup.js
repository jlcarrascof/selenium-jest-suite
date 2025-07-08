const DriverFactory = require('../factories/driverFactory');
const PageFactory = require('../factories/pagesFactory');
const { By, until } = require('selenium-webdriver');

const CONFIG = {
  TIMEOUT: 30000,
  USERNAME: 'javier',
  PASSWORD: '.qwerty123.',
  DASHBOARD_TITLE_SELECTOR: 'h1.text-xl.font-semibold',
  BASE_URL: 'https://login.harmonychurchsuite.com/tenant/user-signin?tenant=qa',
  NOT_FOUND_URL: 'https://qa.harmonychurchsuite.com/404',
  GROUPS_URL: `${global.testConfig.baseUrl}/tenant/groups/index`,
};

let driver, loginPage, profilePage, groupsPage;

const initPages = async () => {
  const driverFactory = new DriverFactory(global.testConfig.currentBrowser, global.testConfig.timeout);
  driver = await driverFactory.initDriver();

  loginPage = PageFactory.createPage('login', driver, `${global.testConfig.baseLoginUrl}`, global.testConfig.timeout);
  profilePage = PageFactory.createPage('profile', driver, CONFIG.BASE_URL, global.testConfig.timeout);
  groupsPage = PageFactory.createPage('groups', driver, global.testConfig.baseUrl, global.testConfig.timeout);

  return { driver, loginPage, profilePage, groupsPage };
};

const login = async () => {
  await loginPage.open();
  await loginPage.enterUsername(CONFIG.USERNAME);
  await loginPage.enterPassword(CONFIG.PASSWORD);
  await loginPage.submitForm();
  await driver.wait(until.elementLocated(By.css(CONFIG.DASHBOARD_TITLE_SELECTOR)), CONFIG.TIMEOUT);
  await profilePage.clickAppsButton();
};

module.exports = {
  CONFIG,
  initPages,
  login,
  get driver() {
    return driver;
  },
  get loginPage() {
    return loginPage;
  },
  get profilePage() {
    return profilePage;
  },
  get groupsPage() {
    return groupsPage;
  }
};
