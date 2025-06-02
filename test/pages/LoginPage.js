import { By } from 'selenium-webdriver';

export class LoginPage {
  /**
   * @param {WebDriver} driver
   */
  constructor(driver) {
    this.driver = driver;
    this.selectors = {
      emailInput: By.css("input[placeholder='Enter your username']"),
      passwordInput: By.css("input[placeholder='Enter your password']"),
      submitButton: By.css("button[type='submit']"),
      errorMessage: By.css('div.mb-8.text-md > p'),
      loader: By.css('[data-testid="loader"]'),
    };
  }

  async enterEmail(email) {
    const input = await this.driver.findElement(this.selectors.emailInput);
    await input.clear();
    await input.sendKeys(email);
  }

  async enterPassword(password) {
    const input = await this.driver.findElement(this.selectors.passwordInput);
    await input.clear();
    await input.sendKeys(password);
  }

  async submitForm() {
    await this.driver.findElement(this.selectors.submitButton).click();
  }

  async getErrorMessage() {
    return await this.driver.findElement(this.selectors.errorMessage).getText();
  }

  async isSubmitButtonEnabled() {
    const button = await this.driver.findElement(this.selectors.submitButton);
    return await button.isEnabled();
  }

  async isLoaderVisible() {
    try {
      const loader = await this.driver.findElement(this.selectors.loader);
      return await loader.isDisplayed();
    } catch {
      return false;
    }
  }
}
