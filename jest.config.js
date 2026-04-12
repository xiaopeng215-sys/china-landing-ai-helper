/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.test.{ts,tsx}',
    '**/tests/**/*.test.{ts,tsx}',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        ...require('./tsconfig.json').compilerOptions,
        jsx: 'react-jsx',
      },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/hooks/**/*.{ts,tsx}',
    'src/lib/api-client.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 60,
      statements: 60,
    },
    './src/hooks/': {
      branches: 60,
      functions: 85,
      lines: 75,
      statements: 75,
    },
  },
};

module.exports = config;
