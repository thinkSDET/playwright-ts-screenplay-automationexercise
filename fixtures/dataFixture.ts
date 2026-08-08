import { test as base } from "@playwright/test";
import loginInput from "../test-data/input/loginData.json";
import loginExpected from "../test-data/expected/loginData.json";

type DataFixtures = {
  loginInput: typeof loginInput;
  loginExpected: typeof loginExpected;
};

export const test = base.extend<DataFixtures>({
  loginInput: async ({}, use) => {
    await use(loginInput);
  },

  loginExpected: async ({}, use) => {
    await use(loginExpected);
  },
});
