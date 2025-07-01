module.exports = [
  {
    selector: "//button[contains(normalize-space(.),'Sign in with Google')]",
    name: 'Sign in with Google',
    tabCount: 1,
    isXPath: true
  },
  {
    selector: "//button[contains(normalize-space(.),'Sign in with Apple')]",
    name: 'Sign in with Apple',
    tabCount: 2,
    isXPath: true
  },
  {
    selector: "input[placeholder='Enter your username']",
    name: 'Username',
    tabCount: 3
  },
  {
    selector: "input[placeholder='Enter your password']",
    name: 'Password',
    tabCount: 4
  },
  {
    selector: "//input[@placeholder='Enter your password']/following-sibling::button",
    name: 'Password Toggle',
    tabCount: 5,
    isXPath: true
  },
  {
    selector: 'input#checkbox[type="checkbox"]',
    name: 'Remember Me',
    tabCount: 6
  },
  {
    selector: "//a[normalize-space(.)='Forgot Password?']",
    name: 'Forgot Password',
    tabCount: 7,
    isXPath: true
  },
  {
    selector: "//a[normalize-space(.)='New Account']",
    name: 'New Account',
    tabCount: 8,
    isXPath: true
  },
  {
    selector: 'menu-context-language button.dropdown-toggle',
    name: 'Language Selector',
    tabCount: 9
  },
  {
    selector: "//button[normalize-space(.)='Contact Us']",
    name: 'Contact Us',
    tabCount: 10,
    isXPath: true
  }
];
