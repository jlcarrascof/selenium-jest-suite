const DriverFactory = require('../factories/driverFactory');
const PageFactory = require('../factories/pagesFactory');

const CONFIG = {
  USERNAME: 'javier',
  PASSWORD: '.qwerty123.',
  INVALID_USERNAME: 'invalidUser',
  INVALID_PASSWORD: 'invalidPass',
  BASE_URL: 'https://login.harmonychurchsuite.com/tenant/user-signin?tenant=qa',
  DASHBOARD_TITLE_SELECTOR: 'h1.text-xl.font-semibold',
  INVALID_LOGIN_MESSAGE: 'Invalid credentials.',
  EXPECTED_URL: 'https://qa.harmonychurchsuite.com/404',
  GROUPS_URL: 'https://qa.harmonychurchsuite.com/tenant/groups/index',
  TIMEOUT: 15000,
  EXPECTED_DASHBOARD_TITLE: /dashboard/i,

  // URLs for 404 pages
  MYPROFILE_URL: 'https://qa.harmonychurchsuite.com/404',
  ROLES_PERMISSIONS_URL: 'https://qa.harmonychurchsuite.com/404',
  USERS_URL: 'https://qa.harmonychurchsuite.com/404',
  EVENT_LOG_URL: 'https://qa.harmonychurchsuite.com/404',
  ALL_NOTIFICATIONS_URL: 'https://qa.harmonychurchsuite.com/404',
  ROLE_NOTIFICATIONS_URL: 'https://qa.harmonychurchsuite.com/404',
  USER_NOTIFICATIONS_URL: 'https://qa.harmonychurchsuite.com/404',
  LANGUAGES_URL: 'https://qa.harmonychurchsuite.com/404',
  REFERENCE_DATA_URL: 'https://qa.harmonychurchsuite.com/404',
  SUBSCRIPTION_DATA_URL: 'https://qa.harmonychurchsuite.com/404',
};

let driver, loginPage, profilePage;

const initPages = async () => {
  const driverFactory = new DriverFactory(global.testConfig.currentBrowser, global.testConfig.timeout);
  driver = await driverFactory.initDriver();

  loginPage = PageFactory.createPage('login', driver, CONFIG.BASE_URL, global.testConfig.timeout);
  profilePage = PageFactory.createPage('profile', driver, CONFIG.BASE_URL, global.testConfig.timeout);

  return { driver, loginPage, profilePage };
};

module.exports = {
  CONFIG,
  initPages,
  get driver() {
    return driver;
  },
  get loginPage() {
    return loginPage;
  },
  get profilePage() {
    return profilePage;
  }
};
