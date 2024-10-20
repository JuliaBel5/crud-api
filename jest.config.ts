export default {
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json", "node"],

  rootDir: "src/tests",
};
