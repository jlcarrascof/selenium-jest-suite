const DriverFactory = require('../factories/driverFactory');
const PageFactory = require('../factories/pagesFactory');

const CONFIG = {
    VALID_USERNAME: 'javier',
    VALID_PASSWORD: '.qwerty123.',
    INVALID_USERNAME: 'maria',
    INVALID_PASSWORD: '.12345.qwerty.',
    EMPTY_USERNAME: '',
    EMPTY_PASSWORD: '',
    TIMEOUT: 90000,
    requiredUsername: 'Username is required',
    requiredPassword: 'Password must be at least 8 characters',
};

let driver, loginPage, landingPage;

const initPages = async () => {
  const driverFactory = new DriverFactory(global.testConfig.currentBrowser, global.testConfig.timeout);
  driver = await driverFactory.initDriver();

  loginPage = PageFactory.createPage('login', driver, `${global.testConfig.baseLoginUrl}`, global.testConfig.timeout);
  landingPage = PageFactory.createPage('landing', driver, `${global.testConfig.baseUrl}`, global.testConfig.timeout);

  return { driver, loginPage, landingPage };
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
  get landingPage() {
    return landingPage;
  }
};
