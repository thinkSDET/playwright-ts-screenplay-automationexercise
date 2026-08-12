import { test as base, Browser } from "@playwright/test";  // 'base' is an alias to avoid naming conflict when we export our own 'test'
import path from "path";   // Node.js built-in to build file paths that work on any machine
import { Routes } from "../utils/routes";
import { LoginLocators } from "../src/locators/LoginLocators";
import loginInput from "../test-data/input/loginData.json";

export const STORAGE_STATE = path.join(__dirname, "../.auth/session.json");
console.log("STORAGE_STATE path:", STORAGE_STATE)

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
      await context.close();
      await use();
    },
    { scope: "test" },
  ],
});