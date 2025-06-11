const LandingPage = require('../pages/LandingPage');
const LoginPage = require('../pages/LoginPage');
const NewAccountPage = require('../pages/NewAccountPage');
const ProfilePage = require('../pages/ProfilePage');

class PageFactory {
  static createPage(pageName, driver, baseUrl, timeout) {
    switch (pageName) {
      case 'landing':
        return new LandingPage(driver, baseUrl, timeout);
      case 'login':
        return new LoginPage(driver, baseUrl, timeout);
      case 'newAccount':
        return new NewAccountPage(driver, baseUrl, timeout);
      case 'profile':
        return new ProfilePage(driver, timeout);
      default:
        throw new Error(`Page not found: ${pageName}`);
    }
  }
}

module.exports = PageFactory;
