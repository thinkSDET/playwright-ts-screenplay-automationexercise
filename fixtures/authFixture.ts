import { test as base, Browser } from "@playwright/test";
import path from "path";
import { Routes } from "../utils/routes";
import { LoginLocators } from "../src/locators/LoginLocators";
import loginInput from "../test-data/input/loginData.json";

export const STORAGE_STATE = path.join(__dirname, "../.auth/session.json");

type AuthFixtures = {
  authenticatedPage: void;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: [
    async ({ browser }, use) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(Routes.login);
      await page.locator(LoginLocators.emailField).fill(loginInput.validuser.email);
      await page.locator(LoginLocators.passwordField).fill(loginInput.validuser.password);
      await page.locator(LoginLocators.loginButton).click();
      await page.waitForURL("**/");
      await context.storageState({ path: STORAGE_STATE });
      console.log("STORAGE_STATE path:", STORAGE_STATE)
      await context.close();
      await use();
    },
    { scope: "test" },
  ],
});