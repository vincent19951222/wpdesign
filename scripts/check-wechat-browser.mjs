import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_APP_URL = process.env.PIXEL_WECHAT_APP_URL || 'http://127.0.0.1:5173/';
const DEFAULT_CHROME_CANDIDATES = [
  process.env.PIXEL_WECHAT_CHROME_PATH,
  process.env.WECHAT_BROWSER_CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
].filter(Boolean);

const DEFAULT_PROFILE_DIR = path.join(os.homedir(), '.wpdesign', 'wechat-browser-profile');

function findChromeExecutable() {
  return DEFAULT_CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate)) || '';
}

function ensureProfileDir(profileDir) {
  fs.mkdirSync(profileDir, { recursive: true });
  return profileDir;
}

async function probeApp(appUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);

  try {
    const response = await fetch(appUrl, { signal: controller.signal });
    return response.ok ? 'reachable' : `http_${response.status}`;
  } catch (error) {
    return 'not_running';
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const chromePath = findChromeExecutable();
  const profileDir = ensureProfileDir(process.env.PIXEL_WECHAT_PROFILE_DIR || DEFAULT_PROFILE_DIR);
  const appUrl = DEFAULT_APP_URL;
  const appStatus = await probeApp(appUrl);

  const result = {
    ok: Boolean(chromePath),
    chromePath: chromePath || null,
    profileDir,
    appUrl,
    appStatus,
    notes: [
      'This skill opens the real wpdesign preview page in a dedicated Chrome profile.',
      'Clicking COPY & OPEN WECHAT in the preview page opens the new-article composer.',
      'First use may require scanning the WeChat QR code inside that Chrome profile.',
    ],
  };

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
