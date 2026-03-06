import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRequire } from 'node:module';
import { WeChatDocument } from './WeChatDocument.js';

const require = createRequire(import.meta.url);
const pixelTheme = require('../../themes/pixel-theme.json');

export const extractImageSourcesFromHtml = (html) => {
  const imageSrcPattern = /<img\b[^>]*\bsrc="([^"]+)"/g;
  const matches = new Set();
  let result = imageSrcPattern.exec(html);

  while (result) {
    matches.add(result[1]);
    result = imageSrcPattern.exec(html);
  }

  return Array.from(matches);
};

export const renderPixelMarkdownToHtml = ({ markdown, renderMode = 'design-preview' }) => {
  const html = renderToStaticMarkup(
    React.createElement(WeChatDocument, {
      content: markdown,
      theme: pixelTheme,
      renderMode,
    }),
  );

  return {
    html,
    imageSources: extractImageSourcesFromHtml(html),
  };
};

export default renderPixelMarkdownToHtml;
