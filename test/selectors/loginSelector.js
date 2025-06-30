module.exports = {
  dashboardTitle: 'h1.text-xl.font-semibold',
  contactUs: 'button.font-semibold.text-hprimary',
  recoverPassword: 'form > div.flex.flex-row.gap-2.justify-between > a',
  newAccount: "a[href*='user-signup']",
  usernameInput: "input[placeholder='Enter your username']",
  passwordInput: "input[placeholder='Enter your password']",
  submitButton: "button[type='submit']",
  modalMessage: 'div.mb-8.text-md > p',
  usernameError: "//p[contains(normalize-space(.),'Username is required')]",
  passwordError: "//p[contains(normalize-space(.),'Password must be at least 8 characters')]",
};
