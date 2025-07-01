const { By, until } = require("selenium-webdriver");
const TIMEOUT = 15000;

async function clickWhenReady(driver, selector, timeout = TIMEOUT) {
  const element = await driver.wait(
    until.elementLocated(By.css(selector)),
    timeout
  );
  await driver.wait(until.elementIsVisible(element), timeout);
  await driver.wait(until.elementIsEnabled(element), timeout);
  await element.click();
}

async function isButtonDisabled(driver, selector) {
  const button = await driver.findElement(By.css(selector));
  return !(await button.isEnabled());
}

module.exports = { clickWhenReady,
    clickButton: clickWhenReady,
    clickLink: clickWhenReady,
    isButtonDisabled };
