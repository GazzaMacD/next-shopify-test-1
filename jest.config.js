module.exports = {
  testEnvironment: `jsdom`,
  setupFilesAfterEnv: [`<rootDir>/jest.setup.ts`],
  testPathIgnorePatterns: [
    `<rootDir>/.next/`,
    `<rootDir>/node_modules/`,
    `<rootDir>/.vscode/`,
  ],
  moduleNameMapper: {
    "\\.(scss|sass|css)$": `identity-obj-proxy`,
    "@/components(.*)$": `<rootDir>/components/$1`,
    "@/common(.*)$": `<rootDir>/common/$1`,
    "@/styles(.*)$": `<rootDir>/styles/$1`,
  },
};
