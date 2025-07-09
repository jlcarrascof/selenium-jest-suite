const DriverFactory = require('../factories/driverFactory');
const PageFactory = require('../factories/pagesFactory');

const CONFIG = {
  LOGIN_PAGE_URL: 'https://login.harmonychurchsuite.com/tenant/user-signin',
  VALID_DATA: {
    name: 'Javier',
    surname: 'Martinez',
    email: 'javier.martinez@example.com',
    username: 'javiermartinez',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    differentPassword: 'Password123*',
  },
  ERROR_MESSAGES: {
    name: 'Name is required',
    surname: 'Surname is required',
    email: 'Please enter a valid email',
    username: 'Username is required',
    password: 'Password must be at least 8 characters',
    terms: 'Terms and Conditions',
    confirmPassword: 'Password must match',
    invalidEmail: 'Please enter a valid email'
  },
  TIMEOUT: 90000,
  INVALID_PASSWORDS: {
    onlyNumbers: '12345678',
    onlyLetters: 'abcdefgh',
    shortLength:   'ab1@'
  },
  INVALID_EMAILS: {
    incomplete: 'test@',
    noDomain: 'user@domain',
    noAtSymbol: 'userdomain.com'
  }
};

let driver, newAccountPage;

const initPages = async () => {
  const driverFactory = new DriverFactory(global.testConfig.currentBrowser, global.testConfig.timeout);
  driver = await driverFactory.initDriver();
  newAccountPage = PageFactory.createPage('newAccount', driver, global.testConfig.baseNewAccountUrl, global.testConfig.timeout);

  return { driver, newAccountPage };
};

module.exports = {
  CONFIG,
  initPages,
  get driver() {
   return driver;
  },
  get newAccountPage() {
    return newAccountPage;
  }
};
