// auth.js
import readline from "readline";
import { initBrowser } from "./utils/browser.js";
import { AUTH_FILE } from "./constants.js";

/**
 * Script to handle manual Facebook login and save session state.
 */
async function runAuth() {
  const { browser, context } = await initBrowser({ headless: false, useAuth: false });
  const page = await context.newPage();

  console.log("🔹 Opening Facebook...");
  await page.goto("https://www.facebook.com");

  console.log("\n-------------------------------------------------------------");
  console.log("👉 ACTION REQUIRED:");
  console.log("1. Manually log in on the opened Chrome window.");
  console.log('2. Check "Keep me signed in" if available.');
  console.log("3. Complete 2FA if prompted.");
  console.log("4. IMPORTANT: Wait until you are on the News Feed and see your avatar.");
  console.log("👉 Once finished, return here and press ENTER to save the session.");
  console.log("-------------------------------------------------------------\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await new Promise((resolve) =>
    rl.question("Press Enter after login is complete...", () => {
      rl.close();
      resolve();
    })
  );

  // Save authentication state
  await context.storageState({ path: AUTH_FILE });
  console.log(`✅ Session saved to ${AUTH_FILE} successfully!`);
  console.log("👉 Now you can run: node crawler.js");

  await browser.close();
}

import { fileURLToPath } from "url";
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAuth().catch((err) => {
    console.error("❌ Error during authentication:", err);
    process.exit(1);
  });
}
