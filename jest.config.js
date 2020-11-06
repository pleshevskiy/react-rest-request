module.exports = {
    testRegex: 'tests/.*\\.spec\\.ts',
    testEnvironment: 'jsdom',
    preset: 'ts-jest',
    moduleFileExtensions: ['ts', 'js', 'json'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
