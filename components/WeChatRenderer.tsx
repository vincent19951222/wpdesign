import React, { Children, isValidElement, cloneElement } from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkGfm from 'remark-gfm';
import { ITheme } from '../types/ITheme';

interface Props {
  content: string;
  theme: ITheme;
}

const WeChatRenderer: React.FC<Props> = ({ content, theme }) => {
  const styles = theme;
  const headerType = theme.meta?.headerType || 'none';
  const footerType = theme.meta?.footerType || 'none';

  return (
    <section id="wechat-output" style={styles.wrapper}>
      {/* Header Bar */}
      {headerType === 'pixel' && (
        <section style={styles.headerBar}>
          <div style={styles.headerBarLeft}>
            <span style={styles.headerMood}>👾 心情：编码中</span>
            <span style={styles.headerWifi}>📡 AI：99%</span>
          </div>
          <div style={styles.headerBarRight}>
            <span style={styles.headerPower}>电源</span>
            <div style={styles.headerBatteryBody}>
              <div style={styles.headerBatteryLevel}></div>
            </div>
          </div>
        </section>
      )}

      {/* Classic / Simple Header could be added here if needed */}

      <section style={styles.section}>
        <ReactMarkdown
          remarkPlugins={[RemarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <section style={styles.h1Container}>
                <h1 style={styles.h1} {...props} />
                <p style={styles.h1Subtitle}>
                  {theme.meta?.description || '演示版本 3.3 | 排版实验室'}
                </p>
              </section>
            ),
            h2: ({ node, ...props }) => (
              <section style={styles.h2Container}>
                <h2 style={styles.h2} {...props} />
              </section>
            ),
            h3: ({ node, ...props }) => (
              <section style={styles.h3Container}>
                <span style={styles.h3Badge}></span>
                <h3 style={styles.h3} {...props} />
              </section>
            ),
            h4: ({ node, ...props }) => (
              <h4 style={styles.h4} {...props} />
            ),
            h5: ({ node, ...props }) => (
              <h5 style={styles.h5 || { ...styles.h4, borderLeftColor: '#00E099' }} {...props} />
            ),
            img: ({ node, ...props }) => (
              <img
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '16px auto',
                  ...styles.img
                }}
                {...props}
              />
            ),
            p: ({ node, ...props }) => <p style={styles.p} {...props} />,
            strong: ({ node, ...props }) => <strong style={styles.strong} {...props} />,
            em: ({ node, ...props }) => <em style={styles.em || { fontStyle: 'italic', color: '#888' }} {...props} />,
            code: ({ node, className, children, ...props }: any) => {
              const isInline = !className;
              if (isInline) {
                return <code style={styles.code} {...props}>{children}</code>
              }
              return (
                <section style={{
                  ...styles.pre,
                  display: 'block',
                  width: '100%',
                  minWidth: '100%',
                  boxSizing: 'border-box'
                }}>
                  <section style={styles.preHeader}>
                    <section style={{ ...styles.preDot, backgroundColor: '#FF4757' }} />
                    <section style={{ ...styles.preDot, backgroundColor: '#FFD700' }} />
                    <section style={{ ...styles.preDot, backgroundColor: '#00E099' }} />
                    <span style={{ marginLeft: 'auto', color: '#00E099', fontFamily: "'Courier New'", fontSize: '12px' }}>代码片段</span>
                  </section>
                  <section style={styles.preBody}>
                    <code {...props}>{children}</code>
                  </section>
                </section>
              )
            },
            pre: ({ node, children, ...props }) => <>{children}</>, // 完全透传，不产生额外包裹层
            a: ({ node, ...props }) => <a style={styles.a} {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote style={styles.blockquote}>
                <section style={styles.blockquoteBadge}>提示</section>
                <section style={styles.blockquoteContent} {...props} />
              </blockquote>
            ),
            hr: () => (
              <section style={styles.hrContainer}>
                <span style={styles.hrText}>•••••</span>
              </section>
            ),
            // Custom OL renderer to handle numbering manually
            ol: ({ node, children, ...props }: any) => {
              // Filter out non-element children (like whitespace/text nodes) to get accurate count
              const validChildren = Children.toArray(children).filter(child => isValidElement(child));

              return (
                <ol style={styles.ol} {...props}>
                  {validChildren.map((child, index) => {
                    if (isValidElement(child)) {
                      // Inject marker for ordered list
                      return cloneElement(child as React.ReactElement<any>, {
                        style: styles.liOl
                      }, [
                        <span key="marker" style={styles.olMarker}>{index + 1}</span>,
                        <span key="content" style={{ flex: 1 }}>{(child as any).props.children}</span>
                      ]);
                    }
                    return child;
                  })}
                </ol>
              )
            },
            // Custom UL renderer to handle bullets manually
            ul: ({ node, children, ...props }: any) => {
              const colors = ['#FF4757', '#FFD700', '#00E099'];
              // Filter out non-element children to keep colors consistent
              const validChildren = Children.toArray(children).filter(child => isValidElement(child));

              return (
                <ul style={styles.ul} {...props}>
                  {validChildren.map((child, index) => {
                    if (isValidElement(child)) {
                      const color = colors[index % 3];
                      return cloneElement(child as React.ReactElement<any>, {
                        style: styles.liUl
                      }, [
                        <span key="marker" style={{ ...styles.ulMarker, backgroundColor: color }} />,
                        <span key="content" style={{ flex: 1 }}>{(child as any).props.children}</span>
                      ]);
                    }
                    return child;
                  })}
                </ul>
              )
            },
            // REMOVED explicit `li` renderer so it defaults to <li>
            // We clone/modify it in the parent ol/ul renderers instead.

            // Handling tables for the "Data Table" look
            table: ({ node, ...props }) => (
              <div style={styles.tableContainer || {
                margin: '20px 0',
                border: '2px solid #1a1a1a',
                overflowX: 'auto',
                width: '100%',
                display: 'block',
                boxSizing: 'border-box',
                boxShadow: '4px 4px 0 #ccc'
              }}>
                <table style={styles.table || { width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center', minWidth: '300px' }} {...props} />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead style={styles.thead || { backgroundColor: '#1a1a1a', color: '#00E099' }} {...props} />
            ),
            th: ({ node, ...props }) => {
              // WeChat strips styles from thead, so we must apply all styles directly to th
              const theadStyle = styles.thead || { backgroundColor: '#1a1a1a', color: '#00E099' };
              const baseThStyle = styles.th || { padding: '10px', border: '1px solid #333', fontFamily: "'Courier New', monospace" };

              const finalThStyle = {
                ...baseThStyle,
                backgroundColor: theadStyle.backgroundColor || '#1a1a1a',
                color: baseThStyle.color || theadStyle.color || '#00E099',
                textAlign: 'center' as const,
              };

              return <th style={finalThStyle} {...props} />;
            },
            td: ({ node, style, ...props }) => {
              // Destructure style from props to prevent it from overriding our styles
              const pColor = styles.p?.color;
              const sectionBg = styles.section?.backgroundColor;

              // Construct base style with fallbacks
              const baseStyle = {
                color: pColor || '#333',
                backgroundColor: sectionBg || '#ffffff',
                padding: '10px',
                border: '1px solid #eee'
              };

              // Merge: baseStyle < theme.td < any passed style (if needed)
              const finalStyle = {
                ...baseStyle,
                ...(styles.td || {}),
                // Ensure color is explicitly set from td.color, not from parent inheritance
                color: styles.td?.color || pColor || '#1a1a1a'
              };

              return (
                <td style={finalStyle} {...props} />
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>

        {/* Footer Signature */}
        <section style={styles.footer}>
          {footerType === 'pixel' && (
            <>
              <section style={styles.footerIcon}>🎮</section>
              <h4 style={{ margin: '0', fontSize: '16px', color: '#1a1a1a' }}>李面条的实验室</h4>
              <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 20px 0', fontFamily: "'Courier New', monospace" }}>
                由 AI 和猫猫共同构建
              </p>

              <section style={{ textAlign: 'center' }}>
                <h2 style={styles.h2}>
                  <a href="#" style={{ color: '#ffffff', textDecoration: 'none', borderBottom: 'none' }}>投币关注</a>
                </h2>
              </section>
            </>
          )}

          {footerType === 'classic' && (
            <>
              <p style={styles.footerText}>
                © {new Date().getFullYear()} {theme.meta?.author || '排版实验室'}. 版权所有.
              </p>
            </>
          )}
        </section>

      </section>

      <section style={{ textAlign: 'center', paddingBottom: '20px', fontSize: '12px', color: '#ccc', fontFamily: 'monospace' }}>
        © {new Date().getFullYear()} {theme.meta?.author || '排版实验室'}. 版权所有.
      </section>
    </section>
  );
};

export default WeChatRenderer;
