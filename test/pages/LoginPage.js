// tests/pages/LoginPage.js
const { By, until, Key } = require('selenium-webdriver');
const WAIT_TIME = 10000;
const TAB_WAIT_TIME = 500; // wait time after each TAB key press


class LoginPage {
  constructor(driver, timeout) {
    this.driver = driver;
    this.timeout = timeout;

    this.selectors = {
      usernameInput: "input[placeholder='Enter your username']",
      passwordInput: "input[placeholder='Enter your password']",
      submitButton: "button[type='submit']",
      modalMessage: 'div.mb-8.text-md > p',
      usernameError: 'p.text-sm.text-hdanger-active'
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

  async getModalMessageText() {
    const modalMsg = await this.driver.wait(
      until.elementLocated(By.css(this.selectors.modalMessage)),
      this.timeout
    );
    return await modalMsg.getText();
  }

  async isSubmitButtonDisabled() {
    const submitBtn = await this.driver.findElement(
      By.css(this.selectors.submitButton)
    );
    return !(await submitBtn.isEnabled());
  }

  async clickLink(selector) {
    const element = await this.driver.wait(
      until.elementLocated(By.css(selector)),
      this.timeout
    );
    await this.driver.wait(until.elementIsVisible(element), this.timeout);
    await this.driver.wait(until.elementIsEnabled(element), this.timeout);
    await element.click();

    // wait for the page to load
    await this.driver.sleep(WAIT_TIME);
    const url = await this.driver.getCurrentUrl();
    return url;
  }

  async canNavigateWithTabsInOrder(controls) {
    const { By, Key, until } = require('selenium-webdriver');
    await this.driver.executeScript('document.body.focus();');
    let sentTabs = 0;
    let allPassed = true;

    for (const { selector, name, tabCount, isXPath = false } of controls) {
      try {
        // wait for the element to be located and visible
        const locator = isXPath ? By.xpath(selector) : By.css(selector);
        const expectedElement = await this.driver.wait(
          until.elementLocated(locator),
          this.timeout,
          `Element "${name}" not found with selector: ${selector}`
        );
        await this.driver.wait(
          until.elementIsVisible(expectedElement),
          this.timeout,
          `Element "${name}" not visible with selector: ${selector}`
        );

        // send TABs to reach the expected element
        const tabsToSend = tabCount - sentTabs;
        sentTabs = tabCount;

        for (let i = 0; i < tabsToSend; i++) {
          await this.driver.actions().sendKeys(Key.TAB).perform();
          await this.driver.sleep(TAB_WAIT_TIME);
        }

        // verify if the expected element is focused
        const activeElement = await this.driver.switchTo().activeElement();
        const isFocused = await this.driver.executeScript(
          'return arguments[0] === document.activeElement;',
          expectedElement
        );

        if (!isFocused) {
          const activeElementHTML = await activeElement.getAttribute('outerHTML');
          console.log(
            `❌ Expected focus on "${name}" (selector: ${selector}) after ${tabCount} TABs, but focus is on: ${activeElementHTML}`
          );
          allPassed = false;
        } else {
          console.log(`✔ Focus on "${name}" after ${tabCount} TABs`);
        }
      } catch (error) {
        console.error(`Error to focus "${name}" with selector ${selector}:`, error.message);
        allPassed = false;
      }
    }

    return allPassed;
  }

  async verifyBlurValidation(selector, expectedValidation = '', isXPath = false, checkClass = false, expectedClass = '') {
    const { By, until } = require('selenium-webdriver');
    try {
      // Localizar el elemento
      const locator = isXPath ? By.xpath(selector) : By.css(selector);
      const element = await this.driver.wait(
        until.elementLocated(locator),
        this.timeout,
        `Element with selector ${selector} not found`
      );
      await this.driver.wait(until.elementIsVisible(element), this.timeout);

      // Enfocar el elemento
      await element.click();
      // Simular pérdida de foco con TAB
      await this.driver.actions().sendKeys(Key.TAB).perform();
      await this.driver.sleep(TAB_WAIT_TIME);

      // Depuración: Imprimir el DOM cercano al input
      const parentHTML = await this.driver.executeScript(
        `return document.querySelector('${selector}').parentElement.outerHTML;`
      );
      console.log(`DOM cercano al input (${selector}):`, parentHTML);

      if (checkClass) {
        // Verificar una clase CSS específica
        const classList = await element.getAttribute('class');
        console.log(`Clases del elemento (${selector}):`, classList);
        return classList.includes(expectedClass);
      } else if (expectedValidation) {
        // Verificar mensaje de error
        const errorSelector = isXPath
          ? `//p[contains(@class, 'text-sm') and contains(@class, 'text-hdanger-active') and contains(text(), '${expectedValidation}')]`
          : `p.text-sm.text-hdanger-active`;
        const validationElement = await this.driver.wait(
          until.elementLocated(By.css(errorSelector)),
          this.timeout,
          `Validation message "${expectedValidation}" not found for ${selector}`
        );
        await this.driver.wait(until.elementIsVisible(validationElement), this.timeout);
        const actualValidation = await validationElement.getText();
        console.log(`Mensaje de validación encontrado: ${actualValidation}`);
        return actualValidation === expectedValidation;
      } else {
        // Verificar ausencia de mensaje de error
        const errorSelector = isXPath
          ? `//p[contains(@class, 'text-sm') and contains(@class, 'text-hdanger-active')]`
          : `p.text-sm.text-hdanger-active`;
        try {
          await this.driver.wait(until.elementLocated(By.css(errorSelector)), 1000);
          console.log(`Mensaje de error encontrado cuando no debería: ${selector}`);
          return false;
        } catch (error) {
          console.log(`No se encontró mensaje de error, como se esperaba: ${selector}`);
          return true;
        }
      }
    } catch (error) {
      console.error(`Error verifying onBlur for ${selector}:`, error.message);
      return false;
    }
  }
}

module.exports = LoginPage;
