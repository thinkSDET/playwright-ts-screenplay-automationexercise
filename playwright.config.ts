import { defineConfig, devices } from "@playwright/test";
import {config} from './utils/envConfig'
import {STORAGE_STATE} from './fixtures/authFixture'

console.log("URL",config.baseURL)
console.log("Storage path:", STORAGE_STATE)
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
        name : "setUp",
        testMatch : "**/*.setup.ts"
     },

    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState :STORAGE_STATE
      },
      dependencies :["setUp"]
    },
     {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] ,storageState :STORAGE_STATE}, dependencies :["setUp"] 
    },
     {
      name: 'webkit',
      use: { ...devices['Desktop Safari'],storageState :STORAGE_STATE }, dependencies :["setUp"]
    },
  ],
});