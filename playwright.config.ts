import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,

  workers: 2,

  use: {
    baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:8443",

    viewport: { width: 1440, height: 900 },

    reducedMotion: "reduce",

    launchOptions: {
      executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",

      args: ["--no-sandbox"],
    },
  },
})
