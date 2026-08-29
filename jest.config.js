/** @type {import('jest').Config} */
module.exports = {
  // Step 1 scope: engine tests only. No React/RN test environment needed —
  // per the build spec, the engine has zero React imports and v1 has no UI tests.
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/engine/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }],
  },
};
