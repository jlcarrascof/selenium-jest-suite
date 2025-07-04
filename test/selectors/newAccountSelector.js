module.exports = {
    nameInput: "input[placeholder='Enter your name']",
    surnameInput: "input[placeholder='Enter your surname']",
    emailInput: "input[placeholder='Enter your email']",
    usernameInput: "input[placeholder='Enter your username']",
    passwordInput: "input[placeholder='Enter your password']",
    confirmPasswordInput: "input[placeholder='Repeat password']",
    termsCheckbox: '//*[@id="checkbox"]',
    createButton: "button[type='submit']",
    nameError: "//p[contains(normalize-space(.),'Name is required')]",
    surnameError: "//p[contains(normalize-space(.),'Surname is required')]",
    emailError: "//p[contains(normalize-space(.),'Please enter a valid email')]",
    usernameError: "//p[contains(normalize-space(.),'Username is required')]",
    passwordError: "//p[contains(normalize-space(.),'Password must be at least 8 characters')]",
    termsError: "//p[contains(normalize-space(.),'Terms and Conditions')]",
    confirmPasswordError: "//p[contains(normalize-space(.),'Password must match')]"
};
