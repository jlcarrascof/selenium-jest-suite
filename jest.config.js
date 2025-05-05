module.exports = {
    testEnvironment: 'node',
    testTimeout: 30000,
    testMatch: ['**/tests/**/*.spec.js'], // Encuentra todos los .spec.js en tests/
    reporters: [
      'default',
      ['jest-junit', { outputDirectory: 'reports', outputName: 'junit.xml' }],
    ],
};
