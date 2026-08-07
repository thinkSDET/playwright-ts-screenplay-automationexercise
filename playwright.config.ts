import { defineConfig, devices } from "@playwright/test";
import {config} from './utils/envConfig'

console.log("URL",config.baseURL)
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.WORKERS ? Number(process.env.WORKERS) : undefined,
  reporter: "html",
  use: {
    headless: process.env.HEADLESS !== "false",
    screenshot: "only-on-failure",
    baseURL: config.baseURL
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});