module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.json",
      babelConfig: {
        presets: ["babel-preset-solid", "@babel/preset-env"],
      },
    },
  },
  testEnvironment: "jsdom",
  testMatch: ["**/?(*.)+(spec|test).+(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    "solid-js/web": "<rootDir>/node_modules/solid-js/web/dist/web.cjs",
    "solid-js": "<rootDir>/node_modules/solid-js/dist/solid.cjs",
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect", "regenerator-runtime"],
};
