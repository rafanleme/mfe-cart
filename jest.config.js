const config = {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "<rootDir>/src/test/styleMock.js",
    "\\.(png|jpg|jpeg|svg)$": "<rootDir>/src/test/fileMock.js"
  }
};

module.exports = config;
