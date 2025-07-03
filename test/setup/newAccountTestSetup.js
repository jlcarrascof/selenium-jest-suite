// test/setup/newAccountTestSetup.js

const DriverFactory = require('../factories/driverFactory');
const PageFactory = require('../factories/pagesFactory');

const VALID_DATA = {
  name: 'Javier',
  surname: 'Martinez',
  email: 'javier.martinez@example.com',
  username: 'javiermartinez',
  password: 'Password123!',
  confirmPassword: 'Password123!',
  differentPassword: 'Password123*'
};

const ERROR_MESSAGES = {
  name: 'Name is required',
  surname: 'Surname is required',
  email: 'Please enter a valid email',
  username: 'Username is required',
  password: 'Password must be at least 8 characters',
  terms: 'Terms and Conditions',
  confirmPassword: 'Password must match',
  invalidEmail: 'Please enter a valid email'
};

const TIMEOUTS = {
  elementVisibility: 5000,
  redirection: 1000,
  global: 90000,
};

let driver, newAccountPage;

const initPages = async () => {
  const driverFactory = new DriverFactory(global.testConfig.currentBrowser, global.testConfig.timeout);
  driver = await driverFactory.initDriver();

  newAccountPage = PageFactory.createPage(
    'newAccount',
    driver,
    `${global.testConfig.baseNewAccountUrl}`,
    global.testConfig.timeout
  );

  return { driver, newAccountPage };
};

module.exports = {
  VALID_DATA,
  ERROR_MESSAGES,
  TIMEOUTS,
  initPages,
  get driver() {
    return driver;
  },
  get newAccountPage() {
    return newAccountPage;
  },
};
