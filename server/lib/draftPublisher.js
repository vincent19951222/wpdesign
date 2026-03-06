const path = require('path');
const { pathToFileURL } = require('url');
const { ApiError } = require('./errors');
const {
  createImageUploadPayloadFromSource,
  replaceImageSourcesInHtml,
} = require('./imageUtils');
const {
  getWeChatAccessToken,
  uploadWeChatCoverImage,
  uploadWeChatContentImage,
  createWeChatDraft,
} = require('./wechatClient');

let rendererModulePromise = null;

function getRendererModule() {
  if (!rendererModulePromise) {
    const rendererPath = path.resolve(__dirname, '../../lib/renderers/renderPixelMarkdownToHtml.js');
    rendererModulePromise = import(pathToFileURL(rendererPath).href);
  }

  return rendererModulePromise;
}

function normalizeRequiredField(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function normalizeOptionalField(value) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

function parseShowCoverPic(value) {
  if (value === '0' || value === 0) {
    return 0;
  }

  if (value === '1' || value === 1 || value == null || value === '') {
    return 1;
  }

  throw new ApiError('INVALID_INPUT', 'showCoverPic must be either "0" or "1".', {
    statusCode: 400,
    details: { value },
  });
}

function validateAndNormalizeInput(parsed) {
  const markdown = normalizeRequiredField(parsed.fields.markdown);
  const title = normalizeRequiredField(parsed.fields.title);
  const author = normalizeRequiredField(parsed.fields.author);
  const digest = normalizeRequiredField(parsed.fields.digest);
  const coverImage = parsed.files.coverImage;

  if (!markdown || !title || !author || !digest) {
    throw new ApiError('INVALID_INPUT', 'markdown, title, author, and digest are required.', {
      statusCode: 400,
      details: {
        markdown: Boolean(markdown),
        title: Boolean(title),
        author: Boolean(author),
        digest: Boolean(digest),
      },
    });
  }

  if (!coverImage) {
    throw new ApiError('MISSING_COVER_IMAGE', 'coverImage is required.', {
      statusCode: 400,
    });
  }

  return {
    markdown,
    title,
    author,
    digest,
    contentSourceUrl: normalizeOptionalField(parsed.fields.contentSourceUrl),
    showCoverPic: parseShowCoverPic(parsed.fields.showCoverPic),
    coverImage,
  };
}

async function renderMarkdown(markdown) {
  let renderer;

  try {
    renderer = await getRendererModule();
  } catch (error) {
    throw new ApiError('RENDER_FAILED', 'Failed to load the shared Markdown renderer.', {
      statusCode: 500,
      details: {
        reason: error instanceof Error ? error.message : 'Unknown import error',
      },
    });
  }

  try {
    return renderer.renderPixelMarkdownToHtml({ markdown });
  } catch (error) {
    throw new ApiError('RENDER_FAILED', 'Failed to render Markdown into WeChat HTML.', {
      statusCode: 500,
      details: {
        reason: error instanceof Error ? error.message : 'Unknown render error',
      },
    });
  }
}

async function publishDraftFromParsedMultipart(parsed) {
  const input = validateAndNormalizeInput(parsed);
  const rendered = await renderMarkdown(input.markdown);
  const imageReplacements = new Map();
  const contentImageUploads = [];
  const { accessToken } = await getWeChatAccessToken();

  for (const source of rendered.imageSources) {
    if (imageReplacements.has(source)) {
      continue;
    }

    const imagePayload = await createImageUploadPayloadFromSource(source);
    const uploadResult = await uploadWeChatContentImage({
      accessToken,
      image: imagePayload,
    });

    imageReplacements.set(source, uploadResult.url);
    contentImageUploads.push({
      source,
      raw: uploadResult.raw,
    });
  }

  const finalHtml = replaceImageSourcesInHtml(rendered.html, imageReplacements);
  const coverUpload = await uploadWeChatCoverImage({
    accessToken,
    fileBuffer: input.coverImage.buffer,
    filename: input.coverImage.filename,
    mimeType: input.coverImage.mimeType,
  });
  const draft = await createWeChatDraft({
    accessToken,
    article: {
      title: input.title,
      author: input.author,
      digest: input.digest,
      content: finalHtml,
      thumbMediaId: coverUpload.thumbMediaId,
      contentSourceUrl: input.contentSourceUrl,
      showCoverPic: input.showCoverPic,
    },
  });

  return {
    success: true,
    draft: {
      mediaId: draft.mediaId,
    },
    wechat: {
      raw: {
        coverUpload: coverUpload.raw,
        contentImageUploads,
        draftAdd: draft.raw,
      },
    },
    render: {
      htmlLength: finalHtml.length,
      imageCount: rendered.imageSources.length,
      replacedImageCount: imageReplacements.size,
    },
  };
}

module.exports = {
  publishDraftFromParsedMultipart,
};
