import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkGfm from 'remark-gfm';
import { createWeChatMarkdownComponents } from './createWeChatMarkdownComponents.js';
import { getRenderTheme } from './getRenderTheme.js';

const COPYRIGHT_STYLE = {
  textAlign: 'center',
  paddingBottom: '20px',
  fontSize: '12px',
  color: '#ccc',
  fontFamily: 'monospace',
};

const BATTERY_BODY_FALLBACK = {
  width: '20px',
  height: '10px',
  border: '1px solid #00E099',
  padding: '1px',
  display: 'inline-block',
  verticalAlign: 'middle',
};

const BATTERY_LEVEL_FALLBACK = {
  width: '100%',
  height: '100%',
  backgroundColor: '#FFD700',
  display: 'block',
};

export const WeChatDocument = ({ content, theme, renderMode = 'design-preview' }) => {
  const styles = getRenderTheme(theme, renderMode);
  const headerType = theme.meta?.headerType || 'none';
  const footerType = theme.meta?.footerType || 'none';
  const isWechatSafe = renderMode === 'wechat-safe';
  const year = new Date().getFullYear();
  const h = React.createElement;
  let footerContent = null;

  if (footerType === 'pixel') {
    footerContent = isWechatSafe
      ? h(
          React.Fragment,
          null,
          h('section', { style: styles.footerIcon }, '🎮'),
          h(
            'h4',
            {
              style: {
                margin: '0 0 10px 0',
                fontSize: '18px',
                color: '#1a1a1a',
                fontWeight: '700',
              },
            },
            theme.meta?.author || '排版实验室',
          ),
          h(
            'p',
            {
              style: {
                fontSize: '14px',
                color: '#999',
                margin: '0 0 24px 0',
                fontFamily: "'Courier New', monospace",
              },
            },
            '由 AI 和猫猫共同构建',
          ),
          h(
            'div',
            { style: { textAlign: 'center' } },
            h(
              'span',
              {
                style: {
                  ...styles.h2,
                  display: 'inline-block',
                  width: 'auto',
                  maxWidth: '100%',
                  margin: '0 auto',
                },
              },
              h(
                'a',
                {
                  href: '#',
                  style: {
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderBottom: 'none',
                  },
                },
                '投币关注',
              ),
            ),
          ),
        )
      : h(
          React.Fragment,
          null,
          h('section', { style: styles.footerIcon }, '🎮'),
          h('h4', { style: { margin: '0', fontSize: '16px', color: '#1a1a1a' } }, '李面条的实验室'),
          h(
            'p',
            {
              style: {
                fontSize: '12px',
                color: '#999',
                margin: '5px 0 20px 0',
                fontFamily: "'Courier New', monospace",
              },
            },
            '由 AI 和猫猫共同构建',
          ),
          h(
            'div',
            { style: { textAlign: 'center' } },
            h(
              'span',
              {
                style: {
                  ...styles.h2,
                  display: 'inline-block',
                },
              },
              h(
                'a',
                {
                  href: '#',
                  style: {
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderBottom: 'none',
                  },
                },
                '投币关注',
              ),
            ),
          ),
        );
  } else if (footerType === 'classic') {
    footerContent = h(
      'p',
      { style: styles.footerText },
      `© ${year} ${theme.meta?.author || '排版实验室'}. 版权所有.`,
    );
  }

  return h(
    'section',
    { id: 'wechat-output', style: styles.wrapper },
    headerType === 'pixel'
      ? h(
          'div',
          {
            style: {
              ...styles.headerBar,
              display: 'block',
            },
          },
          h(
            'span',
            {
              style: {
                ...styles.headerBarLeft,
                display: 'inline-block',
                verticalAlign: 'middle',
              },
            },
            h('span', { style: styles.headerMood }, '👾 心情：编码中'),
            h('span', { style: styles.headerWifi }, '📡 AI：99%'),
          ),
          h(
            'span',
            {
              style: {
                ...styles.headerBarRight,
                display: 'inline-block',
                verticalAlign: 'middle',
                marginLeft: '12px',
                float: isWechatSafe ? 'right' : undefined,
              },
            },
            h('span', { style: styles.headerPower }, ' 电源 '),
            h(
              'span',
              {
                style: {
                  ...BATTERY_BODY_FALLBACK,
                  ...(styles.headerBatteryBody || {}),
                },
              },
              h('span', {
                style: {
                  ...BATTERY_LEVEL_FALLBACK,
                  ...(styles.headerBatteryLevel || {}),
                },
              }),
            ),
          ),
        )
      : null,
    h(
      'section',
      { style: styles.section },
      h(
        ReactMarkdown,
        {
          remarkPlugins: [RemarkGfm],
          components: createWeChatMarkdownComponents(styles, renderMode),
        },
        content,
      ),
      h(
        'section',
        { style: styles.footer },
        footerContent,
      ),
    ),
    isWechatSafe
      ? null
      : h(
          'section',
          { style: COPYRIGHT_STYLE },
          `© ${year} ${theme.meta?.author || '排版实验室'}. 版权所有.`,
        ),
  );
};

export default WeChatDocument;
