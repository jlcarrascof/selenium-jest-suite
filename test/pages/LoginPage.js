// tests/pages/LoginPage.js
const { By, until, Key } = require('selenium-webdriver');
const WAIT_TIME = 10000;
const TAB_WAIT_TIME = 500; // tiempo de espera entre pulsaciones de TAB
const TIMEOUT = 20000; // 20 seconds

class LoginPage {
  constructor(driver, timeout) {
    this.driver = driver;
    this.timeout = timeout;

    this.selectors = {
      usernameInput: "input[placeholder='Enter your username']",
      passwordInput: "input[placeholder='Enter your password']",
      submitButton: "button[type='submit']",
      modalMessage: 'div.mb-8.text-md > p'
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

    // Esperar a que cambie de URL (básico con delay, o mejor con waitUntil)
    await this.driver.sleep(WAIT_TIME); // opción simple para redirección
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
        // Esperar a que el elemento esté presente y visible
        const locator = isXPath ? By.xpath(selector) : By.css(selector);
        const expectedElement = await this.driver.wait(
          until.elementLocated(locator),
          this.timeout,
          `Elemento "${name}" no encontrado con selector: ${selector}`
        );
        await this.driver.wait(
          until.elementIsVisible(expectedElement),
          this.timeout,
          `Elemento "${name}" no está visibles con selector: ${selector}`
        );

        // Enviar las pulsaciones de TAB necesarias
        const tabsToSend = tabCount - sentTabs;
        sentTabs = tabCount;

        for (let i = 0; i < tabsToSend; i++) {
          await this.driver.actions().sendKeys(Key.TAB).perform();
          await this.driver.sleep(TAB_WAIT_TIME);
        }

        // Verificar el elemento activo
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
        console.error(`Error al verificar "${name}" con selector ${selector}:`, error.message);
        allPassed = false;
      }
    }

    return allPassed;
  }
}

module.exports = LoginPage;
