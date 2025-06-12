// tests/pages/LoginPage.js
const { By, until, Key } = require('selenium-webdriver');
const WAIT_TIME = 1000;

class ProfilePage {
  constructor(driver, baseUrl, timeout) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;

    this.selectors = {
      usernameInput: "input[placeholder='Enter your username']",
      passwordInput: "input[placeholder='Enter your password']",
      submitButton: "button[type='submit']",
      profileIcon: 'div.menu-item[data-menu-item-toggle="dropdown"]',
      logoutButton: '//button[contains(text(), "Log out")]',
      appsButton: '//*[@id="header_container"]/div[3]/div[2]/button',
      groupsOption: '//div[span[text()="Groups"]]',
      myProfileLink: '//*[@id="header_container"]/div[3]/div[3]/div/div[2]/div[3]/div/a',
      usersLink: '//span[normalize-space()="Users" and contains(@class, "menu-title")]',
      rolesPermissionsLink: '//span[normalize-space()="Users" and contains(@class, "menu-title")]',
      eventLogLink: '//span[normalize-space()="Event log" and contains(@class, "menu-title")]',
      allNotificationsLink: '//span[normalize-space()="All notifications" and contains(@class, "menu-title")]',
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

  async clickAppsButton() {
    const appsButton = await this.driver.wait(
      until.elementLocated(By.xpath(this.selectors.appsButton)),
      this.timeout
    );
    await appsButton.click();
  }

  async isGroupsOptionVisible() {
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
    await this.driver.sleep(WAIT_TIME); // Esperar redirección
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

  async clickUsersAndGetUrl() {
    return await this.clickElementAndGetUrl('rolesPermissionsLink');
  }

  async clickUsersAndGetUrl() {
    return await this.clickElementAndGetUrl('rolesPermissionsLink');
  }

  async clickEventLogAndGetUrl() {
    return await this.clickElementAndGetUrl('eventLogLink');
  }

  async clickEventLogAndGetUrl() {
    return await this.clickElementAndGetUrl('allNotificationsLink');
  }

}

module.exports = ProfilePage;
