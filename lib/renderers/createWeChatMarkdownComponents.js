import React, { Children, cloneElement, isValidElement } from 'react';

const FALLBACK_H5_BORDER = '#00E099';
const FALLBACK_EM_COLOR = '#888';
const DEFAULT_HR_TEXT = '•••••';
const UL_MARKER_COLORS = ['#FF4757', '#FFD700', '#00E099'];
const BLOCK_DISPLAY_STYLE = {
  display: 'block',
};
const INLINE_BLOCK_STYLE = {
  display: 'inline-block',
  maxWidth: '100%',
};

export const createWeChatMarkdownComponents = (theme, renderMode = 'design-preview') => {
  const styles = theme;
  const h = React.createElement;
  const isWechatSafe = renderMode === 'wechat-safe';
  const titleDisplayStyle = isWechatSafe ? INLINE_BLOCK_STYLE : BLOCK_DISPLAY_STYLE;

  return {
    h1: ({ node, ...props }) => h(
      'div',
      { style: styles.h1Container },
      h(
        'span',
        {
          style: {
            ...styles.h1,
            ...titleDisplayStyle,
          },
          ...props,
        },
      ),
      h(
        'p',
        { style: styles.h1Subtitle },
        theme.meta?.description || '演示版本 3.3 | 排版实验室',
      ),
    ),
    h2: ({ node, ...props }) => h(
      'div',
      { style: styles.h2Container },
      h(
        'span',
        {
          style: {
            ...styles.h2,
            ...titleDisplayStyle,
          },
          ...props,
        },
      ),
    ),
    h3: ({ node, ...props }) => h(
      'section',
      { style: styles.h3Container },
      h('span', { style: styles.h3Badge }),
      h('h3', { style: styles.h3, ...props }),
    ),
    h4: ({ node, ...props }) => h('h4', { style: styles.h4, ...props }),
    h5: ({ node, ...props }) => h(
      'h5',
      { style: styles.h5 || { ...styles.h4, borderLeftColor: FALLBACK_H5_BORDER }, ...props },
    ),
    img: ({ node, ...props }) => h('img', {
      style: {
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        margin: '16px auto',
        ...styles.img,
      },
      ...props,
    }),
    p: ({ node, ...props }) => h('p', { style: styles.p, ...props }),
    strong: ({ node, ...props }) => h('strong', { style: styles.strong, ...props }),
    em: ({ node, ...props }) => h(
      'em',
      { style: styles.em || { fontStyle: 'italic', color: FALLBACK_EM_COLOR }, ...props },
    ),
    code: ({ node, className, children, ...props }) => {
      const isInline = !className;

      if (isInline) {
        return h('code', { style: styles.code, ...props }, children);
      }

      const codeTextStyle = {
        display: 'block',
        margin: 0,
        fontFamily: styles.preBody?.fontFamily || "Menlo, Monaco, Consolas, 'Courier New', monospace",
        fontSize: styles.preBody?.fontSize || '14px',
        lineHeight: styles.preBody?.lineHeight || '1.6',
        color: styles.preBody?.color || (isWechatSafe ? '#00E099' : '#abb2bf'),
        whiteSpace: 'pre',
      };

      return h(
        'div',
        {
          style: {
            ...styles.pre,
            display: 'block',
            width: '100%',
            minWidth: '100%',
            boxSizing: 'border-box',
          },
        },
        isWechatSafe
          ? null
          : h(
              'div',
              {
                style: {
                  ...styles.preHeader,
                  display: 'block',
                  whiteSpace: 'nowrap',
                },
              },
              h('span', {
                style: {
                  ...styles.preDot,
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  backgroundColor: '#FF4757',
                },
              }),
              h('span', {
                style: {
                  ...styles.preDot,
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  backgroundColor: '#FFD700',
                },
              }),
              h('span', {
                style: {
                  ...styles.preDot,
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  backgroundColor: '#00E099',
                },
              }),
              h(
                'span',
                {
                  style: {
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginLeft: '12px',
                    color: '#00E099',
                    fontFamily: "'Courier New'",
                    fontSize: '12px',
                  },
                },
                '代码片段',
              ),
            ),
        h(
          'pre',
          {
            style: {
              ...styles.preBody,
              margin: 0,
              whiteSpace: 'pre',
            },
          },
          h(
            'code',
            {
              ...props,
              style: codeTextStyle,
            },
            children,
          ),
        ),
      );
    },
    pre: ({ node, children }) => h(React.Fragment, null, children),
    a: ({ node, ...props }) => h('a', { style: styles.a, ...props }),
    blockquote: ({ node, ...props }) => h(
      'div',
      { style: styles.blockquote },
      isWechatSafe
        ? h(
            'span',
            {
              style: {
                ...styles.blockquoteBadge,
                display: 'inline-block',
              },
            },
            '提示',
          )
        : h(
            'span',
            {
              style: {
                ...styles.blockquoteBadge,
                display: 'inline-block',
              },
            },
            '提示',
          ),
      h('div', { style: styles.blockquoteContent, ...props }),
    ),
    hr: () => h(
      'section',
      { style: styles.hrContainer },
      h('span', { style: styles.hrText }, DEFAULT_HR_TEXT),
    ),
    ol: ({ node, children, ...props }) => {
      const validChildren = Children.toArray(children).filter((child) => isValidElement(child));

      return h(
        'ol',
        { style: styles.ol, ...props },
        validChildren.map((child, index) => {
          if (!isValidElement(child)) {
            return child;
          }

          return cloneElement(
            child,
            { style: styles.liOl },
            [
              h('span', { key: 'marker', style: styles.olMarker }, index + 1),
              h('span', { key: 'content', style: { flex: 1 } }, child.props.children),
            ],
          );
        }),
      );
    },
    ul: ({ node, children, ...props }) => {
      const validChildren = Children.toArray(children).filter((child) => isValidElement(child));

      return h(
        'ul',
        { style: styles.ul, ...props },
        validChildren.map((child, index) => {
          if (!isValidElement(child)) {
            return child;
          }

          const color = UL_MARKER_COLORS[index % UL_MARKER_COLORS.length];

          return cloneElement(
            child,
            { style: styles.liUl },
            [
              h('span', { key: 'marker', style: { ...styles.ulMarker, backgroundColor: color } }),
              h('span', { key: 'content', style: { flex: 1 } }, child.props.children),
            ],
          );
        }),
      );
    },
    table: ({ node, ...props }) => h(
      'div',
      {
        style: styles.tableContainer || {
          margin: '20px 0',
          border: '2px solid #1a1a1a',
          overflowX: 'auto',
          width: '100%',
          display: 'block',
          boxSizing: 'border-box',
          boxShadow: '4px 4px 0 #ccc',
        },
      },
      h('table', {
        style: styles.table || {
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
          textAlign: 'center',
          minWidth: '300px',
        },
        ...props,
      }),
    ),
    thead: ({ node, ...props }) => h(
      'thead',
      { style: styles.thead || { backgroundColor: '#1a1a1a', color: '#00E099' }, ...props },
    ),
    th: ({ node, ...props }) => {
      const theadStyle = styles.thead || { backgroundColor: '#1a1a1a', color: '#00E099' };
      const baseThStyle = styles.th || {
        padding: '10px',
        border: '1px solid #333',
        fontFamily: "'Courier New', monospace",
      };

      return h('th', {
        style: {
          ...baseThStyle,
          backgroundColor: theadStyle.backgroundColor || '#1a1a1a',
          color: baseThStyle.color || theadStyle.color || '#00E099',
          textAlign: 'center',
        },
        ...props,
      });
    },
    td: ({ node, style, ...props }) => {
      const pColor = styles.p?.color;
      const sectionBg = styles.section?.backgroundColor;

      return h('td', {
        style: {
          color: pColor || '#333',
          backgroundColor: sectionBg || '#ffffff',
          padding: '10px',
          border: '1px solid #eee',
          ...(styles.td || {}),
          color: styles.td?.color || pColor || '#1a1a1a',
        },
        ...props,
      });
    },
  };
};

export default createWeChatMarkdownComponents;
