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
      profileIcon: 'div.menu-toggle.btn.btn-icon.rounded-full',
      logoutButton: '//button[contains(text(), "Log out")]',
      appsButton: '//*[@id="header_container"]/div[3]/div[2]/button',
      groupsOption: '//div[span[text()="Groups"]]',
      myProfileLink: '//*[@id="header_container"]/div[3]/div[3]/div/div[2]/div[3]/div/a',
      reportsLink: '//a[normalize-space()="Reports" and contains(@class, "flex") and contains(@href, "/tenant/groups/edit")]',
      calendarLink: '//a[normalize-space()="Calendar" and contains(@class, "flex") and contains(@href, "/calendar")]',
      resourcesLink: '//a[normalize-space()="Resources" and contains(@class, "flex") and contains(@href, "/resources")]',
      createGroupButton: 'button.bg-\\[\\#37b200\\].text-white.rounded-lg',
      groupFormTitle: '#modal-title',
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

  async clickLogoutAndGetUrl(expectedUrl) {
    const logoutBtn = await this.driver.wait(
      until.elementLocated(By.xpath(this.selectors.logoutButton)),
      this.timeout
    );

    await this.driver.wait(until.elementIsVisible(logoutBtn), this.timeout);
    await logoutBtn.click();

    await this.driver.wait(until.urlIs(expectedUrl), this.timeout);

    return await this.driver.getCurrentUrl();
  }

  async clickCreateGroup() {
    const button = await this.driver.wait(
        until.elementLocated(By.css(this.selectors.createGroupButton)),
        this.timeout
    );
    await button.click();
  }

  async getGroupFormTitle() {
    const title = await this.driver.wait(
        until.elementLocated(By.css(this.selectors.groupFormTitle)),
        this.timeout
    );
    return await title.getText();
  }

    async clickEditIconOnImage() {
        const editIcon = await this.driver.wait(
            until.elementLocated(By.css('img[alt="add image"]')),
            this.timeout
        );

        await editIcon.click();
    }

    async selectFirstImageFromGallery() {
        const firstImage = await this.driver.wait(
            until.elementLocated(By.css('app-images img[alt="3"]')), // selector único por alt
            this.timeout
        );

        await firstImage.click();
    }

    async confirmImageSelection() {
        const selectButton = await this.driver.wait(
            until.elementLocated(By.xpath("//button[contains(text(),'Select')]")),
            this.timeout
        );
        await selectButton.click();
    }

    async getGroupImagePreviewSrc() {
        const previewImage = await this.driver.wait(
            until.elementLocated(By.css('form img[alt="3"]')), // alt "3" coincide con galería
            this.timeout
        );
        return await previewImage.getAttribute('src');
    }

    async cancelImageSelection() {
        const cancelButton = await this.driver.wait(
            until.elementLocated(By.xpath("//button[contains(text(), 'Cancel')]")),
            this.timeout
        );
        await cancelButton.click();
    }

    async isImagePreviewEmpty() {

      const text = await this.driver.findElement(By.xpath("//*[contains(text(), 'Allowed file types')]"));

      return await text.isDisplayed();
    }

    async focusAndBlurNameInput() {
      const nameInput = await this.driver.wait(
        until.elementLocated(By.css('input[formcontrolname="name"]')),
        this.timeout
      );
      await nameInput.click();
      await nameInput.sendKeys(Key.TAB);
    }

    async isNameRequiredMessageVisible() {
      const error = await this.driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(), 'Name is required')]")),
        this.timeout
      );
      return await error.isDisplayed();
    }

    async focusAndBlurPurposeInput() {
      const purposeInput = await this.driver.wait(
        until.elementLocated(By.css('textarea[formcontrolname="purpose"]')),
        this.timeout
      );
      await purposeInput.click();
      await purposeInput.sendKeys(Key.TAB);
    }

    async isPurposeRequiredMessageVisible() {
      const error = await this.driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(), 'Purpose is required')]")),
        this.timeout
      );
      return await error.isDisplayed();
    }

    async isMeetingDateRequiredMessageVisible() {
      const error = await this.driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(), 'Meeting date info is required')]")),
        this.timeout
      );
      return await error.isDisplayed();
    }

    async focusAndBlurLocationInput() {
      const locationInput = await this.driver.wait(
        until.elementLocated(By.css('input[formcontrolname="location"]')),
        this.timeout
      );

      await this.driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", locationInput);

      await locationInput.sendKeys(Key.TAB);

      const errorMessage = await this.driver.wait(
        until.elementLocated(By.xpath("//p[contains(text(),'Location is required')]")),
        this.timeout
      );

      const text = await errorMessage.getText();
      return text;
    }

    async isLocationRequiredMessageVisible() {
      const error = await this.driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(), 'Location is required')]")),
        this.timeout
      );
      return await error.isDisplayed();
    }

    async clickElementAndGetUrl(selectorKey) {
      const selector = this.selectors[selectorKey];
      const isXPath = selector.trim().startsWith('//') || selector.trim().startsWith('(');

      const element = isXPath
        ? await this.driver.findElement(By.xpath(selector))
        : await this.driver.findElement(By.css(selector));

      await element.click();
      await this.driver.wait(until.urlContains('harmonychurchsuite.com'), this.timeout);

      return await this.driver.getCurrentUrl();
    }

    async focusAndBlurMeetingDateInput() {
      const meetingDateInput = await this.driver.wait(
        until.elementLocated(By.css('input[formcontrolname="meeting_date"]')),
        this.timeout
      );

      await this.driver.executeScript(
        "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});",
        meetingDateInput
      );

      await meetingDateInput.sendKeys(Key.TAB);

      const errorMessage = await this.driver.wait(
        until.elementLocated(By.xpath("//p[contains(text(),'Meeting date info is required')]")),
        this.timeout
      );

      const text = await errorMessage.getText();
      return text;
    }

}

module.exports = GroupsPage;
