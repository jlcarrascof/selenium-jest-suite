const { By } = require("selenium-webdriver");

async function fillTextField(driver, selector, value) {
  const field = await driver.findElement(By.css(selector));
  await field.clear();
  await field.sendKeys(value);
}

module.exports = { fillTextField };
