/**
 * Jest Configuration for Backend Tests
 */

export default {
  testEnvironment: "node",
  testMatch: ["**/backend/**/*.test.js"],
  verbose: true,
  collectCoverageFrom: ["../server/src/**/*.js"],
  testPathIgnorePatterns: ["/node_modules/"]
};
