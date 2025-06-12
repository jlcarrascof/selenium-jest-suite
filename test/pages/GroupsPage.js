// tests/pages/LoginPage.js
const { By, until, Key } = require('selenium-webdriver');
const { resource } = require('selenium-webdriver/http');
const WAIT_TIME = 1000;

class GroupsPage {
  constructor(driver, baseUrl, timeout) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;

    this.selectors = {
      profileIcon: 'div.menu-item[data-menu-item-toggle="dropdown"]',
      logoutButton: '//button[contains(text(), "Log out")]',
      appsButton: '//*[@id="header_container"]/div[3]/div[2]/button',
      groupsOption: '//div[span[text()="Groups"]]',
      myProfileLink: '//*[@id="header_container"]/div[3]/div[3]/div/div[2]/div[3]/div/a',
      reportsLink: '//a[normalize-space()="Reports" and contains(@class, "flex") and contains(@href, "/tenant/groups/edit")]',
      calendarLink: '//a[normalize-space()="Calendar" and contains(@class, "flex") and contains(@href, "/calendar")]',
      resourcesLink: '//a[normalize-space()="Resources" and contains(@class, "flex") and contains(@href, "/resources")]',
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
    await this.driver.sleep(WAIT_TIME);
  }

  async isOnLoginPage() {
    await this.driver.sleep(WAIT_TIME);

    const currentUrl = await this.driver.getCurrentUrl();

    return currentUrl.startsWith(this.baseUrl);
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

  async clickReportsAndGetUrl() {
    return await this.clickElementAndGetUrl('reportsLink');
  }

  async clickCalendarAndGetUrl() {
    return await this.clickElementAndGetUrl('calendarLink');
  }

  async clickResourcesAndGetUrl() {
    return await this.clickElementAndGetUrl('resourcesLink');
  }

}

module.exports = GroupsPage;
