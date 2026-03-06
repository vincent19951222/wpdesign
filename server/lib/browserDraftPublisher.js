const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright-core');
const { ApiError } = require('./errors');

const DEFAULT_PROFILE_DIR = path.join(os.homedir(), '.wpdesign', 'wechat-browser-publisher-profile');
const GENERATED_DIR = path.resolve(__dirname, '../../public/.generated');
const PAYLOAD_FILENAME = 'wechat-browser-draft.json';
const WECHAT_HOME_URL = 'https://mp.weixin.qq.com/';
const CHROME_CANDIDATES = [
  process.env.PIXEL_WECHAT_CHROME_PATH,
  process.env.WECHAT_BROWSER_CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
].filter(Boolean);

function findChromeExecutable(explicitPath = '') {
  if (explicitPath && fs.existsSync(explicitPath)) {
    return explicitPath;
  }

  return CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate)) || '';
}

function ensureGeneratedDir() {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  return GENERATED_DIR;
}

function writePreviewPayload(payload) {
  ensureGeneratedDir();
  const filePath = path.join(GENERATED_DIR, PAYLOAD_FILENAME);
  fs.writeFileSync(filePath, JSON.stringify({
    ...payload,
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

async function waitForPreviewPageReady(page, timeoutMs) {
  await page.goto(page.url(), { waitUntil: 'domcontentloaded' });
  await page.locator('#wechat-output').waitFor({ timeout: timeoutMs });
  await page.waitForTimeout(1200);
}

async function copyPreviewIntoClipboard(page) {
  const success = await page.evaluate(() => {
    const node = document.getElementById('wechat-output');
    if (!node) {
      return false;
    }

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNode(node);
    selection?.removeAllRanges();
    selection?.addRange(range);
    const ok = document.execCommand('copy');
    selection?.removeAllRanges();
    return ok;
  });

  if (!success) {
    throw new ApiError('BROWSER_COPY_FAILED', 'Failed to copy preview content into clipboard.', { statusCode: 500 });
  }
}

async function waitForWechatHome(page, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const menu = page.locator('.new-creation__menu');
    if (await menu.count()) {
      return true;
    }
    await page.waitForTimeout(1000);
  }

  return false;
}

async function openEditorPage(homePage, context) {
  const itemLocator = homePage
    .locator('.new-creation__menu .new-creation__menu-item')
    .filter({ hasText: '文章' })
    .first();

  await itemLocator.waitFor({ timeout: 20000 });
  const pagePromise = context.waitForEvent('page', { timeout: 10000 }).catch(() => null);
  await itemLocator.click();
  const popup = await pagePromise;

  if (popup) {
    await popup.waitForLoadState('domcontentloaded');
    return popup;
  }

  await homePage.waitForTimeout(3000);
  return homePage;
}

async function fillEditorAndSave(editorPage, { title, author }) {
  await editorPage.locator('#title').waitFor({ timeout: 30000 });
  await editorPage.locator('#title').fill(title);

  const authorField = editorPage.locator('#author');
  if (await authorField.count()) {
    await authorField.fill(author);
  }

  const editor = editorPage.locator('.ProseMirror');
  await editor.waitFor({ timeout: 30000 });
  await editor.click();

  const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
  await editorPage.keyboard.press(`${modifier}+V`);
  await editorPage.waitForTimeout(2500);

  const hasContent = await editor.evaluate((node) => (node.innerText || '').trim().length > 0);
  if (!hasContent) {
    throw new ApiError('WECHAT_PASTE_FAILED', 'WeChat editor appears empty after paste.', { statusCode: 500 });
  }

  const saveButton = editorPage.locator('button').filter({ hasText: '保存为草稿' }).first();
  await saveButton.waitFor({ timeout: 30000 });
  await saveButton.click();
  await editorPage.waitForTimeout(1500);

  const saved = await editorPage.waitForFunction(() => {
    const hasHistory = Array.from(document.querySelectorAll('.weui-desktop-version__row')).some((row) => {
      return (row.textContent || '').includes('手动保存');
    });
    const hasAppmsgId = /[?&]appmsgid=\d+/.test(window.location.href);
    return hasHistory || hasAppmsgId;
  }, { timeout: 20000 }).then(() => true).catch(() => false);

  if (!saved) {
    throw new ApiError('WECHAT_SAVE_FAILED', 'WeChat editor did not enter a visible saved state.', { statusCode: 500 });
  }
}

function normalizeText(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function readRecentDrafts(homePage) {
  await homePage.goto(WECHAT_HOME_URL, { waitUntil: 'domcontentloaded' });
  await homePage.waitForTimeout(3000);
  await homePage.reload({ waitUntil: 'domcontentloaded' });
  await homePage.waitForTimeout(3000);

  return homePage.evaluate(() => {
    return Array.from(document.querySelectorAll('.weui-desktop-card.weui-desktop-publish')).map((card) => {
      const title = card.querySelector('.weui-desktop-publish__cover__title')?.textContent || '';
      const desc = card.querySelector('.weui-desktop-publish__cover__desc')?.textContent || '';
      const tips = card.querySelector('.weui-desktop-publish__tips')?.textContent || '';
      return { title, desc, tips };
    });
  });
}

async function verifyDraftSaved(homePage, title) {
  const drafts = await readRecentDrafts(homePage);
  const targetTitle = normalizeText(title);
  const matchedDraft = drafts.find((draft) => normalizeText(draft.title) === targetTitle);

  if (!matchedDraft) {
    return {
      saved: false,
      recentDraftTitles: drafts.map((draft) => normalizeText(draft.title)).filter(Boolean),
    };
  }

  return {
    saved: true,
    draft: {
      title: normalizeText(matchedDraft.title),
      desc: normalizeText(matchedDraft.desc),
      tips: normalizeText(matchedDraft.tips),
    },
  };
}

async function publishWechatBrowserDraft({
  markdown,
  title,
  author = 'wpdesign',
  appUrl,
  theme,
  renderMode = 'wechat-safe',
  profileDir = process.env.PIXEL_WECHAT_PUBLISH_PROFILE_DIR || DEFAULT_PROFILE_DIR,
  chromePath = '',
  loginWaitMs = 120000,
}) {
  if (!markdown || !String(markdown).trim()) {
    throw new ApiError('INVALID_INPUT', 'Missing markdown content.', { statusCode: 400 });
  }

  if (!appUrl) {
    throw new ApiError('INVALID_INPUT', 'Missing appUrl for browser draft publishing.', { statusCode: 400 });
  }

  const resolvedTitle = String(title || '').trim() || '像素风排版草稿';
  const resolvedAuthor = String(author || '').trim() || 'wpdesign';
  const resolvedChromePath = findChromeExecutable(chromePath);

  if (!resolvedChromePath) {
    throw new ApiError('CHROME_NOT_FOUND', 'Chrome executable not found for browser draft publishing.', { statusCode: 500 });
  }

  const payloadPath = writePreviewPayload({
    markdown,
    title: resolvedTitle,
    theme,
    renderMode,
  });
  const previewUrl = buildPreviewUrl(appUrl, resolvedTitle);

  let context;
  try {
    context = await chromium.launchPersistentContext(profileDir, {
      headless: false,
      executablePath: resolvedChromePath,
      viewport: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('ProcessSingleton')) {
      throw new ApiError(
        'PROFILE_IN_USE',
        `Chrome profile is already in use: ${profileDir}. Close the existing Chrome window for this publishing profile, or change PIXEL_WECHAT_PUBLISH_PROFILE_DIR.`,
        { statusCode: 409, details: { profileDir } }
      );
    }

    throw error;
  }

  let shouldClose = true;

  try {
    const previewPage = await context.newPage();
    await previewPage.goto(previewUrl, { waitUntil: 'domcontentloaded' });
    await waitForPreviewPageReady(previewPage, 30000);
    await copyPreviewIntoClipboard(previewPage);

    const homePage = await context.newPage();
    await homePage.goto(WECHAT_HOME_URL, { waitUntil: 'domcontentloaded' });
    const loggedIn = await waitForWechatHome(homePage, loginWaitMs);

    if (!loggedIn) {
      shouldClose = false;
      throw new ApiError(
        'WECHAT_LOGIN_TIMEOUT',
        'WeChat login was not completed in time. Scan the QR code in the opened browser window, then retry.',
        { statusCode: 408 }
      );
    }

    const editorPage = await openEditorPage(homePage, context);
    await fillEditorAndSave(editorPage, {
      title: resolvedTitle,
      author: resolvedAuthor,
    });

    const saveResult = await verifyDraftSaved(homePage, resolvedTitle);
    if (!saveResult.saved) {
      throw new ApiError(
        'WECHAT_SAVE_UNCONFIRMED',
        `Draft save could not be confirmed. Recent drafts: ${saveResult.recentDraftTitles.join(' | ')}`,
        { statusCode: 500 }
      );
    }

    return {
      success: true,
      title: resolvedTitle,
      author: resolvedAuthor,
      previewUrl,
      payloadPath,
      editorUrl: editorPage.url(),
      draft: saveResult.draft,
    };
  } catch (error) {
    shouldClose = false;
    throw error;
  } finally {
    if (shouldClose) {
      await context.close();
    }
  }
}

module.exports = {
  publishWechatBrowserDraft,
};
