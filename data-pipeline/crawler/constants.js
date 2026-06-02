// constants.js

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const GROUP_URLS = [
  "https://www.facebook.com/groups/utethacmachoctap",
  "https://www.facebook.com/groups/congdongsinhvien.hcmute",
];
export const DEFAULT_VIEWPORT = { width: 1366, height: 768 };
export const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

export const AUTH_FILE = path.join(__dirname, "auth.json");
