const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({ testDir: './tests', workers: 1, use: { baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:5173', browserName: 'chromium', channel: process.env.TEST_BROWSER_CHANNEL || undefined }, webServer: process.env.TEST_BASE_URL ? undefined : { command: 'npm run dev', url: 'http://127.0.0.1:5173', reuseExistingServer: true } });

