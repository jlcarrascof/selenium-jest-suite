const { By, until } = require('selenium-webdriver');

async function getModalText(driver, selector, timeout) {
  const modalMsg = await driver.wait(until.elementLocated(By.css(selector)), timeout);
  return await modalMsg.getText();
}

module.exports = { getModalText };
