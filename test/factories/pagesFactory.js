const LandingPage = require('../pages/LandingPage');
const LoginPage = require('../pages/LoginPage');

class PageFactory {
  static createPage(pageName, driver, baseUrl, timeout) {
    switch (pageName) {
      case 'landing':
        return new LandingPage(driver, baseUrl, timeout);
      case 'login':
        return new LoginPage(driver, timeout);
      default:
        throw new Error(`Page not found: ${pageName}`);
    }
  }
}

module.exports = PageFactory;
