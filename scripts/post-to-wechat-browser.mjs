import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';

const DEFAULT_APP_URL = process.env.PIXEL_WECHAT_APP_URL || 'http://127.0.0.1:5173/';
const DEFAULT_PROFILE_DIR = path.join(os.homedir(), '.wpdesign', 'wechat-browser-profile');
const GENERATED_DIR = path.resolve(process.cwd(), 'public/.generated');
const PAYLOAD_FILENAME = 'pixel-post-to-wechat.json';
const CHROME_CANDIDATES = [
  process.env.PIXEL_WECHAT_CHROME_PATH,
  process.env.WECHAT_BROWSER_CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
].filter(Boolean);

function parseArgs(argv) {
  const options = {
    markdown: '',
    markdownFile: '',
    title: '',
    useDemo: false,
    renderOnly: false,
    profileDir: process.env.PIXEL_WECHAT_PROFILE_DIR || DEFAULT_PROFILE_DIR,
    chromePath: '',
    appUrl: DEFAULT_APP_URL,
    port: 5173,
    author: '',
    coverImage: '',
    keepOpen: false,
    saveDraft: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    switch (arg) {
      case '--markdown':
        options.markdown = argv[index + 1] || '';
        index += 1;
        break;
      case '--markdown-file':
        options.markdownFile = argv[index + 1] || '';
        index += 1;
        break;
      case '--title':
        options.title = argv[index + 1] || '';
        index += 1;
        break;
      case '--profile-dir':
        options.profileDir = argv[index + 1] || options.profileDir;
        index += 1;
        break;
      case '--chrome-path':
        options.chromePath = argv[index + 1] || '';
        index += 1;
        break;
      case '--app-url':
        options.appUrl = argv[index + 1] || options.appUrl;
        index += 1;
        break;
      case '--port':
        options.port = Number(argv[index + 1] || options.port);
        index += 1;
        break;
      case '--author':
        options.author = argv[index + 1] || '';
        index += 1;
        break;
      case '--cover-image':
        options.coverImage = argv[index + 1] || '';
        index += 1;
        break;
      case '--use-demo':
        options.useDemo = true;
        break;
      case '--render-only':
        options.renderOnly = true;
        break;
      case '--keep-open':
        options.keepOpen = true;
        break;
      case '--no-save-draft':
        options.saveDraft = false;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function findChromeExecutable(explicitPath = '') {
  if (explicitPath && fs.existsSync(explicitPath)) {
    return explicitPath;
  }

  return CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate)) || '';
}

function extractDefaultMarkdownFromApp() {
  const source = fs.readFileSync(path.resolve(process.cwd(), 'App.tsx'), 'utf8');
  const match = source.match(/const DEFAULT_MD = `([\s\S]*?)`;/);

  if (!match) {
    throw new Error('Failed to extract DEFAULT_MD from App.tsx');
  }

  return match[1]
    .replace(/\\`/g, '`')
    .replace(/\\\$\{/g, '${');
}

function loadMarkdown(options) {
  if (options.markdown) {
    return options.markdown;
  }

  if (options.markdownFile) {
    return fs.readFileSync(path.resolve(process.cwd(), options.markdownFile), 'utf8');
  }

  if (options.useDemo) {
    return extractDefaultMarkdownFromApp();
  }

  throw new Error('Provide --markdown, --markdown-file, or --use-demo.');
}

function deriveTitle(markdown, explicitTitle = '') {
  if (explicitTitle) {
    return explicitTitle.trim();
  }

  const match = markdown.match(/^\s*#\s+(.+)$/m);
  return match?.[1]?.trim() || '像素风排版预览';
}

function ensureGeneratedDir() {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  return GENERATED_DIR;
}

function writePreviewPayload({ markdown, title }) {
  ensureGeneratedDir();
  const filePath = path.join(GENERATED_DIR, PAYLOAD_FILENAME);
  fs.writeFileSync(filePath, JSON.stringify({
    title,
    markdown,
    generatedAt: new Date().toISOString(),
  }, null, 2));
  return filePath;
}

function buildPreviewUrl(appUrl, title) {
  const base = new URL(appUrl);
  base.searchParams.set('skill-preview', '1');
  base.searchParams.set('payload', `/.generated/${PAYLOAD_FILENAME}?v=${Date.now()}`);
  if (title) {
    base.searchParams.set('title', title);
  }
  return base.toString();
}

async function isAppReady(appUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);

  try {
    const response = await fetch(appUrl, { signal: controller.signal });
    return response.ok;
  } catch (error) {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForApp(appUrl, timeoutMs = 45000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isAppReady(appUrl)) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return false;
}

function startDevServer(port) {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const child = spawn(npmCommand, ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port)], {
    cwd: process.cwd(),
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
  return child.pid || null;
}

async function ensureAppReady(appUrl, port) {
  if (await isAppReady(appUrl)) {
    return { startedDevServer: false, devServerPid: null };
  }

  const devServerPid = startDevServer(port);
  const ready = await waitForApp(appUrl);
  if (!ready) {
    throw new Error(`Local preview app did not start in time at ${appUrl}`);
  }

  return { startedDevServer: true, devServerPid };
}

function launchChromePreview(chromePath, profileDir, previewUrl) {
  fs.mkdirSync(profileDir, { recursive: true });

  const child = spawn(chromePath, [
    `--user-data-dir=${profileDir}`,
    '--new-window',
    '--no-first-run',
    '--no-default-browser-check',
    previewUrl,
  ], {
    detached: true,
    stdio: 'ignore',
  });

  child.unref();
  return child.pid || null;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const markdown = loadMarkdown(options);
  const title = deriveTitle(markdown, options.title);
  const chromePath = findChromeExecutable(options.chromePath);

  if (!chromePath) {
    throw new Error('Chrome executable not found. Set PIXEL_WECHAT_CHROME_PATH or install Google Chrome.');
  }

  if (options.coverImage) {
    console.warn('[pixel-post] Skill preview mode does not upload the cover image. This step remains manual.');
  }

  if (options.author) {
    console.warn('[pixel-post] Skill preview mode does not auto-fill the author. This step remains manual in WeChat.');
  }

  const payloadPath = writePreviewPayload({ markdown, title });
  const previewUrl = buildPreviewUrl(options.appUrl, title);

  if (options.renderOnly) {
    console.log(JSON.stringify({
      success: true,
      mode: 'skill-preview',
      title,
      previewUrl,
      payloadPath,
      profileDir: options.profileDir,
      manualNextSteps: [
        'Open the preview page.',
        'Click COPY & OPEN WECHAT.',
        'Log in to WeChat Official Account if needed.',
        'Paste into the new article editor manually.',
      ],
    }, null, 2));
    return;
  }

  const appStatus = await ensureAppReady(options.appUrl, options.port);
  const chromePid = launchChromePreview(chromePath, options.profileDir, previewUrl);

  console.log(JSON.stringify({
    success: true,
    mode: 'skill-preview',
    title,
    previewUrl,
    payloadPath,
    profileDir: options.profileDir,
    chromePid,
    startedDevServer: appStatus.startedDevServer,
    devServerPid: appStatus.devServerPid,
    manualNextSteps: [
      'Review the pixel preview in Chrome.',
      'Click COPY & OPEN WECHAT in the preview page.',
      'Scan the QR code if the WeChat page asks for login.',
      'Paste into the WeChat new-article editor manually.',
    ],
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
