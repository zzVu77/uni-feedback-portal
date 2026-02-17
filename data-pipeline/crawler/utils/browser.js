// utils/browser.js
import { chromium } from "playwright";
import { DEFAULT_VIEWPORT, DEFAULT_USER_AGENT, AUTH_FILE } from "../constants.js";
import fs from "fs";

/**
 * Initializes a Playwright browser and context.
 * @param {Object} options - Custom options for the browser and context.
 * @param {boolean} options.headless - Whether to run in headless mode.
 * @param {boolean} options.useAuth - Whether to use the stored authentication state.
 * @returns {Promise<{browser: import('playwright').Browser, context: import('playwright').BrowserContext}>}
 */
export async function initBrowser(options = { headless: false, useAuth: false }) {
  const browser = await chromium.launch({ headless: options.headless });
  
  const contextOptions = {
    viewport: DEFAULT_VIEWPORT,
    userAgent: DEFAULT_USER_AGENT,
  };

  if (options.useAuth && fs.existsSync(AUTH_FILE)) {
    contextOptions.storageState = AUTH_FILE;
  }

  const context = await browser.newContext(contextOptions);
  
  return { browser, context };
}
