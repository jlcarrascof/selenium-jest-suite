// tests/pages/ProfilePage.js
const { By, until, Key } = require('selenium-webdriver');
const selectors = require("../selectors/profileSelector");
const DOMHandler = require('../lib/DOMHandler');

const WAIT_TIME = 2000;

class ProfilePage {
  constructor(driver, baseUrl, timeout) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.selectors = selectors;
    this.sectionMap = {
      roles:            this.selectors.rolesPermissionsLink,
      users:            this.selectors.usersLink,
      eventLog:         this.selectors.eventLogLink,
      allNotifications: this.selectors.allNotificationsLink,
      roleNotifications:this.selectors.roleNotificationsLink,
      userNotifications:this.selectors.userNotificationsLink,
      languages:        this.selectors.languagesLink,
      referenceData:    this.selectors.referenceDataLink,
      subscription:     this.selectors.subscriptionLink,
    };
    this.domHandler = new DOMHandler(driver, timeout);
  }

  async isSubmitButtonDisabled() {
    const submitBtn = await this.driver.findElement(
      By.css(this.selectors.submitButton)
    );

    return !(await submitBtn.isEnabled());
  }

  async openUserMenu() {
    await this.domHandler.clickWhenReady(this.selectors.profileIcon);
    await this.domHandler.waitForElementVisible(this.selectors.logoutButton, true);

    return true;
  }

  async openMainMenuAndSeeGroupsOption() {
    const appsButton = await this.driver.wait(
      until.elementLocated(By.xpath(this.selectors.appsButton)),
      this.timeout
    );
    await appsButton.click();

    const groupsOption = await this.driver.wait(
      until.elementLocated(By.xpath(this.selectors.groupsOption)),
      this.timeout
    );
    await this.driver.wait(until.elementIsVisible(groupsOption), this.timeout);

    return true;
  }

  async clickLogout() {
    const logoutButton = await this.driver.wait(
      until.elementLocated(By.xpath(this.selectors.logoutButton)),
      this.timeout
    );

    await logoutButton.click();
    await this.driver.sleep(WAIT_TIME);
  }

  async isOnLoginPage() {
    await this.driver.sleep(WAIT_TIME);

    const currentUrl = await this.driver.getCurrentUrl();

    return currentUrl.startsWith(this.baseUrl);
  }

  async clickLogoutAndGetUrl() {
    return await this.domHandler.clickAndGetUrl(this.selectors.logoutButton, true);
  }

  async clickGroupsAndGetUrl() {
    return await this.domHandler.clickAndGetUrl(this.selectors.groupsOption, true);
  }

  async clickMyProfileAndGetUrl() {
    return await this.domHandler.clickAndGetUrl(this.selectors.myProfileLink, true);
  }

  async clickElementAndGetUrl(selectorKey) {
    const selector = this.selectors[selectorKey];
    const element = await this.driver.wait(
      until.elementLocated(By.xpath(selector)),
      this.timeout
    );

    await element.click();

    await this.driver.sleep(WAIT_TIME);

    const url = await this.driver.getCurrentUrl();

    return url;
  }

  async openSectionAndGetUrl(sectionKey) {
    const selector = this.sectionMap[sectionKey];

    if (!selector) {
      throw new Error(`Unknown sectionKey: "${sectionKey}"`);
    }

    const element = await this.driver.wait(
      until.elementLocated(By.xpath(selector)),
      this.timeout
    );

    await element.click();
    await this.driver.sleep(WAIT_TIME);

    return await this.driver.getCurrentUrl();
  }

  async navigateToSection(sectionKey) {
    const selector = this.sectionMap[sectionKey];

    if (!selector) {
      throw new Error(`Unknown sectionKey: "${sectionKey}"`);
    }

    return await this.domHandler.clickAndGetUrl(selector, true);
  }
}

module.exports = ProfilePage;
