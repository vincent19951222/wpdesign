const { ApiError } = require('./errors');

const DEFAULT_WECHAT_API_BASE_URL = 'https://api.weixin.qq.com/cgi-bin';
const DEFAULT_TOKEN_REFRESH_SKEW_SECONDS = 300;

let tokenCache = null;

function getConfig() {
  const appId = process.env.WECHAT_OFFICIAL_APP_ID;
  const appSecret = process.env.WECHAT_OFFICIAL_APP_SECRET;
  const baseUrl = (process.env.WECHAT_API_BASE_URL || DEFAULT_WECHAT_API_BASE_URL).replace(/\/+$/, '');
  const refreshSkewSeconds = Number(process.env.WECHAT_TOKEN_REFRESH_SKEW_SECONDS || DEFAULT_TOKEN_REFRESH_SKEW_SECONDS);

  if (!appId || !appSecret) {
    throw new ApiError('WECHAT_AUTH_FAILED', 'WeChat official account credentials are not configured.', {
      statusCode: 500,
      details: {
        missing: {
          WECHAT_OFFICIAL_APP_ID: !appId,
          WECHAT_OFFICIAL_APP_SECRET: !appSecret,
        },
      },
    });
  }

  return {
    appId,
    appSecret,
    baseUrl,
    refreshSkewMs: Math.max(refreshSkewSeconds, 0) * 1000,
  };
}

function buildApiUrl(pathname) {
  return `${getConfig().baseUrl}${pathname}`;
}

function isWeChatApiError(payload) {
  return typeof payload?.errcode === 'number' && payload.errcode !== 0;
}

async function readJsonResponse(response, fallbackCode, fallbackMessage) {
  const rawText = await response.text();
  let payload = null;

  try {
    payload = rawText ? JSON.parse(rawText) : null;
  } catch (error) {
    throw new ApiError(fallbackCode, fallbackMessage, {
      statusCode: 502,
      details: {
        status: response.status,
        statusText: response.statusText,
        raw: rawText,
      },
    });
  }

  if (!response.ok) {
    throw new ApiError(fallbackCode, fallbackMessage, {
      statusCode: 502,
      details: {
        status: response.status,
        statusText: response.statusText,
        raw: payload,
      },
    });
  }

  return payload;
}

async function getWeChatAccessToken() {
  const { appId, appSecret, refreshSkewMs } = getConfig();
  const now = Date.now();

  if (
    tokenCache &&
    tokenCache.appId === appId &&
    tokenCache.expiresAt > now + refreshSkewMs
  ) {
    return {
      accessToken: tokenCache.accessToken,
      expiresAt: tokenCache.expiresAt,
    };
  }

  const tokenUrl = buildApiUrl(
    `/token?grant_type=client_credential&appid=${encodeURIComponent(appId)}&secret=${encodeURIComponent(appSecret)}`,
  );

  let response;

  try {
    response = await fetch(tokenUrl);
  } catch (error) {
    throw new ApiError('WECHAT_TOKEN_FETCH_FAILED', 'Failed to fetch WeChat access token.', {
      statusCode: 502,
      details: {
        reason: error instanceof Error ? error.message : 'Unknown fetch error',
      },
    });
  }

  const payload = await readJsonResponse(
    response,
    'WECHAT_TOKEN_FETCH_FAILED',
    'Failed to fetch WeChat access token.',
  );

  if (isWeChatApiError(payload)) {
    throw new ApiError('WECHAT_AUTH_FAILED', 'WeChat authentication failed.', {
      statusCode: 502,
      details: payload,
    });
  }

  if (!payload?.access_token || typeof payload?.expires_in !== 'number') {
    throw new ApiError('WECHAT_TOKEN_FETCH_FAILED', 'WeChat access token response is invalid.', {
      statusCode: 502,
      details: payload,
    });
  }

  tokenCache = {
    appId,
    accessToken: payload.access_token,
    expiresAt: now + (payload.expires_in * 1000),
  };

  return {
    accessToken: tokenCache.accessToken,
    expiresAt: tokenCache.expiresAt,
  };
}

async function uploadWeChatCoverImage({ accessToken, fileBuffer, filename, mimeType }) {
  const form = new FormData();
  form.append('media', new Blob([fileBuffer], { type: mimeType }), filename);

  let response;

  try {
    response = await fetch(
      buildApiUrl(`/material/add_material?access_token=${encodeURIComponent(accessToken)}&type=thumb`),
      {
        method: 'POST',
        body: form,
      },
    );
  } catch (error) {
    throw new ApiError('WECHAT_COVER_UPLOAD_FAILED', 'Failed to upload cover image to WeChat.', {
      statusCode: 502,
      details: {
        reason: error instanceof Error ? error.message : 'Unknown upload error',
      },
    });
  }

  const payload = await readJsonResponse(
    response,
    'WECHAT_COVER_UPLOAD_FAILED',
    'Failed to upload cover image to WeChat.',
  );

  if (isWeChatApiError(payload)) {
    throw new ApiError('WECHAT_COVER_UPLOAD_FAILED', 'WeChat cover image upload failed.', {
      statusCode: 502,
      details: payload,
    });
  }

  if (!payload?.media_id) {
    throw new ApiError('WECHAT_COVER_UPLOAD_FAILED', 'WeChat cover upload response is invalid.', {
      statusCode: 502,
      details: payload,
    });
  }

  return {
    thumbMediaId: payload.media_id,
    raw: payload,
  };
}

async function uploadWeChatContentImage({ accessToken, image }) {
  const form = new FormData();
  form.append('media', new Blob([image.buffer], { type: image.mimeType }), image.filename);

  let response;

  try {
    response = await fetch(
      buildApiUrl(`/media/uploadimg?access_token=${encodeURIComponent(accessToken)}`),
      {
        method: 'POST',
        body: form,
      },
    );
  } catch (error) {
    throw new ApiError('WECHAT_CONTENT_IMAGE_UPLOAD_FAILED', 'Failed to upload content image to WeChat.', {
      statusCode: 502,
      details: {
        reason: error instanceof Error ? error.message : 'Unknown upload error',
      },
    });
  }

  const payload = await readJsonResponse(
    response,
    'WECHAT_CONTENT_IMAGE_UPLOAD_FAILED',
    'Failed to upload content image to WeChat.',
  );

  if (isWeChatApiError(payload)) {
    throw new ApiError('WECHAT_CONTENT_IMAGE_UPLOAD_FAILED', 'WeChat content image upload failed.', {
      statusCode: 502,
      details: payload,
    });
  }

  if (!payload?.url) {
    throw new ApiError('WECHAT_CONTENT_IMAGE_UPLOAD_FAILED', 'WeChat content image response is invalid.', {
      statusCode: 502,
      details: payload,
    });
  }

  return {
    url: payload.url,
    raw: payload,
  };
}

async function createWeChatDraft({ accessToken, article }) {
  let response;

  try {
    response = await fetch(
      buildApiUrl(`/draft/add?access_token=${encodeURIComponent(accessToken)}`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articles: [
            {
              title: article.title,
              author: article.author,
              digest: article.digest,
              content: article.content,
              thumb_media_id: article.thumbMediaId,
              content_source_url: article.contentSourceUrl || '',
              show_cover_pic: article.showCoverPic,
            },
          ],
        }),
      },
    );
  } catch (error) {
    throw new ApiError('WECHAT_DRAFT_CREATE_FAILED', 'Failed to create WeChat draft.', {
      statusCode: 502,
      details: {
        reason: error instanceof Error ? error.message : 'Unknown request error',
      },
    });
  }

  const payload = await readJsonResponse(
    response,
    'WECHAT_DRAFT_CREATE_FAILED',
    'Failed to create WeChat draft.',
  );

  if (isWeChatApiError(payload)) {
    throw new ApiError('WECHAT_DRAFT_CREATE_FAILED', 'WeChat draft creation failed.', {
      statusCode: 502,
      details: payload,
    });
  }

  if (!payload?.media_id) {
    throw new ApiError('WECHAT_DRAFT_CREATE_FAILED', 'WeChat draft response is invalid.', {
      statusCode: 502,
      details: payload,
    });
  }

  return {
    mediaId: payload.media_id,
    raw: payload,
  };
}

module.exports = {
  getWeChatAccessToken,
  uploadWeChatCoverImage,
  uploadWeChatContentImage,
  createWeChatDraft,
};
