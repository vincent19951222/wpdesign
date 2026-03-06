const path = require('path');
const { ApiError } = require('./errors');

const SUPPORTED_REMOTE_PROTOCOLS = new Set(['http:', 'https:']);
const DATA_URL_PATTERN = /^data:([^;,]+)?(?:;charset=[^;,]+)?(;base64)?,([\s\S]+)$/i;
const HTML_ENTITY_MAP = {
  '&amp;': '&',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&lt;': '<',
  '&gt;': '>',
};

function decodeHtmlEntities(value) {
  return value.replace(/&(amp|quot|#39|#x27|lt|gt);/g, (match) => HTML_ENTITY_MAP[match] || match);
}

function sanitizeFilenameSegment(value) {
  return value.replace(/[^a-zA-Z0-9._-]/g, '-');
}

function extensionFromMimeType(mimeType) {
  const normalized = (mimeType || '').toLowerCase();

  switch (normalized) {
    case 'image/jpeg':
    case 'image/jpg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/gif':
      return '.gif';
    case 'image/webp':
      return '.webp';
    case 'image/svg+xml':
      return '.svg';
    default:
      return '';
  }
}

function filenameFromUrl(urlValue, fallbackExt = '') {
  try {
    const parsed = new URL(urlValue);
    const pathname = parsed.pathname || '';
    const basename = path.basename(pathname);

    if (basename && basename !== '/') {
      return sanitizeFilenameSegment(basename);
    }
  } catch (error) {
    // Ignore malformed URL here; upstream validation handles it.
  }

  return `image-${Date.now()}${fallbackExt}`;
}

async function fetchRemoteImage(source) {
  const decodedSource = decodeHtmlEntities(source);
  let url;

  try {
    url = new URL(decodedSource);
  } catch (error) {
    throw new ApiError('UNSUPPORTED_IMAGE_SOURCE', 'Only http/https remote images are supported.', {
      statusCode: 400,
      details: { source },
    });
  }

  if (!SUPPORTED_REMOTE_PROTOCOLS.has(url.protocol)) {
    throw new ApiError('UNSUPPORTED_IMAGE_SOURCE', 'Only http/https remote images are supported.', {
      statusCode: 400,
      details: { source },
    });
  }

  let response;

  try {
    response = await fetch(decodedSource);
  } catch (error) {
    throw new ApiError('IMAGE_FETCH_FAILED', 'Failed to download remote image.', {
      statusCode: 502,
      details: { source, reason: error instanceof Error ? error.message : 'Unknown fetch error' },
    });
  }

  if (!response.ok) {
    throw new ApiError('IMAGE_FETCH_FAILED', 'Failed to download remote image.', {
      statusCode: 502,
      details: { source, status: response.status, statusText: response.statusText },
    });
  }

  const mimeType = response.headers.get('content-type')?.split(';')[0] || 'application/octet-stream';
  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = filenameFromUrl(decodedSource, extensionFromMimeType(mimeType));

  return {
    buffer,
    filename,
    mimeType,
  };
}

function parseDataUrlImage(source) {
  const match = DATA_URL_PATTERN.exec(source);

  if (!match) {
    throw new ApiError('UNSUPPORTED_IMAGE_SOURCE', 'Unsupported data URL image format.', {
      statusCode: 400,
      details: { sourcePreview: source.slice(0, 80) },
    });
  }

  const mimeType = match[1] || 'application/octet-stream';
  const isBase64 = Boolean(match[2]);
  const payload = match[3] || '';
  const buffer = isBase64
    ? Buffer.from(payload, 'base64')
    : Buffer.from(decodeURIComponent(payload), 'utf8');
  const filename = `inline-image-${Date.now()}${extensionFromMimeType(mimeType)}`;

  return {
    buffer,
    filename,
    mimeType,
  };
}

async function createImageUploadPayloadFromSource(source) {
  if (source.startsWith('data:')) {
    return parseDataUrlImage(source);
  }

  if (source.startsWith('http://') || source.startsWith('https://')) {
    return fetchRemoteImage(source);
  }

  throw new ApiError('UNSUPPORTED_IMAGE_SOURCE', 'Only data URL and http/https images are supported.', {
    statusCode: 400,
    details: { source },
  });
}

function replaceImageSourcesInHtml(html, replacements) {
  let output = html;

  for (const [originalSource, replacementSource] of replacements.entries()) {
    output = output.split(`src="${originalSource}"`).join(`src="${replacementSource}"`);
  }

  return output;
}

module.exports = {
  createImageUploadPayloadFromSource,
  replaceImageSourcesInHtml,
};
