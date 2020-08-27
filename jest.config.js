module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "setupFiles": [
      "./setupJest.js",
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "testPathIgnorePatterns": [
    "<rootDir>/node_modules/",
    "<rootDir>/src/public/react/demo-app/"
  ],
  "coveragePathIgnorePatterns": [
    "<rootDir>/node_modules/"
  ]
}