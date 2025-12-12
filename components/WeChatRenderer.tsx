import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkGfm from 'remark-gfm';
import { styles } from '../utils/pixelStyles';

interface Props {
  content: string;
}

const WeChatRenderer: React.FC<Props> = ({ content }) => {
  return (
    <section id="wechat-output" style={styles.wrapper}>
      {/* Header Bar */}
      <section style={{
            backgroundColor: '#1a1a1a',
            color: '#00E099',
            padding: '10px 15px',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '4px solid #FFD700',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            marginBottom: '20px'
      }}>
         <div>
            <span style={{marginRight: '10px'}}>👾 MOOD: CODING</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
             <span style={{marginRight: '5px'}}>PWR</span>
             <div style={{width: '20px', height: '10px', border: '1px solid #00E099', padding: '1px', display: 'flex'}}>
                <div style={{width: '100%', height: '100%', backgroundColor: '#FFD700'}}></div>
             </div>
        </div>
      </section>

      <section style={styles.section}>
        <ReactMarkdown
          remarkPlugins={[RemarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <div style={styles.h1Container}>
                <h1 style={styles.h1} {...props} />
                <p style={styles.h1Subtitle}>DEMO VERSION 3.3 | BY PIXEL LAB</p>
              </div>
            ),
            h2: ({ node, ...props }) => (
              <div style={styles.h2Container}>
                <h2 style={styles.h2} {...props} />
              </div>
            ),
            h3: ({ node, ...props }) => (
              <div style={styles.h3Container}>
                <span style={styles.h3Badge}>H3</span>
                <h3 style={styles.h3} {...props} />
              </div>
            ),
            h4: ({ node, ...props }) => (
              <h4 style={styles.h4} {...props} />
            ),
            h5: ({ node, ...props }) => (
               <h5 style={{...styles.h4, borderLeftColor: '#00E099'}} {...props} />
            ),
            p: ({ node, ...props }) => <p style={styles.p} {...props} />,
            strong: ({ node, ...props }) => <strong style={styles.strong} {...props} />,
            em: ({ node, ...props }) => <em style={{ fontStyle: 'italic', color: '#888' }} {...props} />,
            code: ({ node, inline, ...props }) => {
                if (inline) {
                   return <code style={styles.code} {...props} />
                }
                return (
                    <div style={styles.pre}>
                        <div style={styles.preHeader}>
                            <div style={{...styles.preDot, backgroundColor: '#FF4757'}} />
                            <div style={{...styles.preDot, backgroundColor: '#FFD700'}} />
                            <div style={{...styles.preDot, backgroundColor: '#00E099'}} />
                            <span style={{marginLeft: 'auto', color: '#00E099', fontFamily: "'Courier New'", fontSize: '12px'}}>code.block</span>
                        </div>
                        <div style={styles.preBody}>
                             <code {...props} />
                        </div>
                    </div>
                )
            },
            pre: ({ node, ...props }) => <div {...props} />, // Handled by code block above
            a: ({ node, ...props }) => <a style={styles.a} {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote style={styles.blockquote}>
                <div style={styles.blockquoteBadge}>NOTE</div>
                <div style={styles.blockquoteContent} {...props} />
              </blockquote>
            ),
            hr: () => (
                <section style={styles.hrContainer}>
                    <span style={styles.hrText}>•••••</span>
                </section>
            ),
            ul: ({ node, ...props }) => <ul style={styles.ul} {...props} />,
            ol: ({ node, ...props }) => <ol style={styles.ol} {...props} />,
            li: ({ node, index, ordered, ...props }) => {
                return (
                    <li style={styles.li}>
                       <span style={{position: 'absolute', left: 0, color: '#FFD700', fontWeight: 'bold'}}>►</span>
                       {props.children}
                    </li>
                )
            },
            // Handling tables for the "Data Table" look
            table: ({node, ...props}) => (
                <section style={{
                    margin: '20px 0', 
                    border: '2px solid #1a1a1a', 
                    overflowX: 'auto', 
                    width: '100%',
                    boxShadow: '4px 4px 0 #ccc'
                }}>
                    <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center', minWidth: '300px'}} {...props} />
                </section>
            ),
            thead: ({node, ...props}) => (
                <thead style={{backgroundColor: '#1a1a1a', color: '#00E099'}} {...props} />
            ),
            th: ({node, ...props}) => (
                <th style={{padding: '10px', border: '1px solid #333', fontFamily: "'Courier New', monospace"}} {...props} />
            ),
            td: ({node, ...props}) => (
                <td style={{padding: '10px', border: '1px solid #eee'}} {...props} />
            )
          }}
        >
          {content}
        </ReactMarkdown>

        {/* Footer Signature */}
        <section style={styles.footer}>
             <div style={styles.footerIcon}>🍜</div>
             <h4 style={{margin: '0', fontSize: '16px', color: '#1a1a1a'}}>李面条的实验室</h4>
             <p style={{fontSize: '12px', color: '#999', margin: '5px 0 20px 0', fontFamily: "'Courier New', monospace"}}>
                BUILDING WITH AI & CATS
             </p>
        </section>

      </section>
      
      <section style={{textAlign: 'center', paddingBottom: '20px', fontSize: '12px', color: '#ccc', fontFamily: 'monospace'}}>
         © 2025 PIXEL LAB. ALL RIGHTS RESERVED.
      </section>
    </section>
  );
};

export default WeChatRenderer;