global.testConfig = {
    env: 'qa',
    timeout: 120000, // Increase timeout for all tests
    baseUrl: 'https://qa.harmonychurchsuite.com',
    baseLoginUrl: 'https://login.harmonychurchsuite.com/tenant/user-signin?tenant=qa',
    baseNewAccountUrl: 'https://login.harmonychurchsuite.com/tenant/user-signup?tenant=qa',
    forgotPasswordRedirectUrl: 'https://login.harmonychurchsuite.com/landing',
    currentBrowser: 'chrome'
};
