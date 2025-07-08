// tests/pages/LoginPage.js
const { By, until, Key } = require('selenium-webdriver');
const WAIT_TIME = 2000;

class ProfilePage {
  constructor(driver, baseUrl, timeout) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;

    this.selectors = {

    };
  }

  async enterUsername(username) {
    const usernameField = await this.driver.findElement(
      By.css(this.selectors.usernameInput)
    );

    await usernameField.clear();
    await usernameField.sendKeys(username);
  }

  async enterPassword(password) {
    const passwordField = await this.driver.findElement(
      By.css(this.selectors.passwordInput)
    );

    await passwordField.clear();
    await passwordField.sendKeys(password);
  }

  async clickSubmit() {
    const submitBtn = await this.driver.wait(
      until.elementLocated(By.css(this.selectors.submitButton)),
      this.timeout
    );

    await this.driver.wait(until.elementIsVisible(submitBtn), this.timeout);
    await this.driver.wait(until.elementIsEnabled(submitBtn), this.timeout);
    await submitBtn.click();
  }

  async isSubmitButtonDisabled() {
    const submitBtn = await this.driver.findElement(
      By.css(this.selectors.submitButton)
    );

    return !(await submitBtn.isEnabled());
  }

  async clickProfileIcon() {
    const profileIcon = await this.driver.wait(
      until.elementLocated(By.css(this.selectors.profileIcon)),
      this.timeout
    );

    await profileIcon.click();
  }

  async isLogoutButtonVisible() {
    const logoutButton = await this.driver.wait(
      until.elementLocated(By.xpath(this.selectors.logoutButton)),
      this.timeout
    );

    return await this.driver.wait(until.elementIsVisible(logoutButton), this.timeout);
  }

  async clickLogout() {
    const logoutButton = await this.driver.wait(
      until.elementLocated(By.xpath(this.selectors.logoutButton)),
      this.timeout
    );

    await logoutButton.click();
    await this.driver.sleep(WAIT_TIME); // Añadir espera
  }

  async isOnLoginPage() {
    await this.driver.sleep(WAIT_TIME);

    const currentUrl = await this.driver.getCurrentUrl();

    return currentUrl.startsWith(this.baseUrl); // Más flexible para parámetros adicionales
  }

  async openMainMenu() {
    const appsButton = await this.driver.wait(
      until.elementLocated(By.xpath(this.selectors.appsButton)),
      this.timeout
    );
    await appsButton.click();
  }

  async seeGroupsOption() {
    try {
      const groupsOption = await this.driver.wait(
        until.elementLocated(By.xpath(this.selectors.groupsOption)),
        this.timeout
      );
      await this.driver.wait(until.elementIsVisible(groupsOption), this.timeout);
      return true;
    } catch (error) {
      console.error('Error verifying Groups option visibility:', error.message);
      return false;
    }
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

  async clickLogoutAndGetUrl() {
    return await this.clickElementAndGetUrl('logoutButton');
  }

  async clickGroupsAndGetUrl() {
    return await this.clickElementAndGetUrl('groupsOption');
  }

  async clickMyProfileAndGetUrl() {
    return await this.clickElementAndGetUrl('myProfileLink');
  }

  async clickUsersAndGetUrl() {
    return await this.clickElementAndGetUrl('usersLink');
  }

  async clickRolesPermissionsAndGetUrl() {
    return await this.clickElementAndGetUrl('rolesPermissionsLink');
  }

  async clickEventLogAndGetUrl() {
    return await this.clickElementAndGetUrl('eventLogLink');
  }

  async clickAllNotificationsAndGetUrl() {
    return await this.clickElementAndGetUrl('allNotificationsLink');
  }

  async clickRoleNotificationsAndGetUrl() {
    return await this.clickElementAndGetUrl('roleNotificationsLink');
  }

  async clickUserNotificationsAndGetUrl() {
    return await this.clickElementAndGetUrl('userNotificationsLink');
  }

  async clickLanguagesAndGetUrl() {
    return await this.clickElementAndGetUrl('languagesLink');
  }

  async clickReferenceDataAndGetUrl() {
    return await this.clickElementAndGetUrl('referenceDataLink');
  }

  async clickSubscriptionAndGetUrl() {
    return await this.clickElementAndGetUrl('subscriptionLink');
  }

}

module.exports = ProfilePage;
