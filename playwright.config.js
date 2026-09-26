const { defineConfig } = require("@playwright/test")

module.exports = defineConfig({
  testDir: "test/browser",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } }
  ]
})
