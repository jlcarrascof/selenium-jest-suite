// tests/pages/NewAccountPage.js
const { By, until, Key } = require('selenium-webdriver');

class NewAccountPage {
  constructor(driver, baseUrl, timeout) {
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;

    this.selectors = {
      name: "input[placeholder='Enter your name']",
      surname: "input[placeholder='Enter your surname']",
      email: "input[placeholder='Email']",
      username: "input[placeholder='Username']",
      password: "input[placeholder='Password']",
      confirmPassword: "input[placeholder='Confirm Password']",
      termsCheckbox: "input[type='checkbox']",
      createButton: "button[type='submit']"
    };

    this.validationMessages = {
      name: "Name is required",
      surname: "Enter your surname",
      email: "Please enter a valid email",
      username: "Username is required",
      password: "Enter your password",
      confirmPassword: "Confirm password"
    };
  }

  async open() {
    await this.driver.get(this.baseUrl);
    await this.driver.wait(until.urlContains(this.baseUrl), this.timeout);
  }

  async verifyBlurValidation(fieldName, expectedValidation) {
    const selector = this.selectors[`${fieldName}Input`];
    console.log(`👉 Selector encontrado para ${fieldName}:`, selector);

    if (!selector || typeof selector !== 'string') {
      throw new Error(`❌ Selector inválido para el campo "${fieldName}". Revisa this.selectors`);
    }
    const input = await this.driver.findElement(By.css(selector));

    // Trigger blur with TAB
    await input.click();
    await this.driver.actions().sendKeys(Key.TAB).perform();
    await this.driver.sleep(500);

    // XPath robusto para mensajes de error
    const errorSelector = `//p[contains(@class, 'text-sm') and contains(@class, 'text-hdanger') and normalize-space()='${expectedValidation}']`;

    console.log(`🔍 Buscando mensaje de validación con XPath: ${errorSelector}`);

    try {
      const errorElement = await this.driver.wait(
        until.elementLocated(By.xpath(errorSelector)),
        WAIT_TIME
      );

      const actualValidation = await errorElement.getText();
      console.log(`✅ Texto de validación encontrado: "${actualValidation}"`);

      return actualValidation === expectedValidation;
    } catch (error) {
      console.error(`❌ No se encontró el mensaje de validación: ${expectedValidation}`);
      return false;
    }
  }
}

module.exports = NewAccountPage;
