const { By, until } = require("selenium-webdriver");

async function clickWhenReady(driver, selector, timeout = 5000) {
  const element = await driver.wait(
    until.elementLocated(By.css(selector)),
    timeout
  );
  await driver.wait(until.elementIsVisible(element), timeout);
  await driver.wait(until.elementIsEnabled(element), timeout);
  await element.click();
}

module.exports = { clickWhenReady };
