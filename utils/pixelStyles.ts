import { CSSProperties } from 'react';

// These styles match your provided text/html demo EXACTLY.
// We use inline styles because WeChat ignores external CSS classes.

export const styles = {
  // Main Container Body
  wrapper: {
    margin: '0',
    padding: '20px 10px', // Added padding to ensure content isn't flush against edge in WeChat
    backgroundColor: '#f7f9fa',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
    minHeight: 'auto', // Changed from 100vh to avoid layout breaking in WeChat editor
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden' // Prevents horizontal scrollbars from breaking layout
  } as CSSProperties,

  section: {
    backgroundColor: '#ffffff',
    padding: '20px 15px',
    borderRadius: '4px', // Slight radius for better look
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)', // Subtle shadow for the card
    marginBottom: '30px',
    boxSizing: 'border-box',
  } as CSSProperties,

  // Level 1 Header (The main title box)
  h1Container: {
    textAlign: 'center',
    marginBottom: '50px',
    lineHeight: '1.2',
  } as CSSProperties,
  h1: {
    display: 'inline-block',
    backgroundColor: '#FFD700',
    color: '#1a1a1a',
    padding: '12px 20px',
    border: '3px solid #1a1a1a',
    boxShadow: '5px 5px 0px #1a1a1a',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '22px',
    fontWeight: 900,
    margin: '0',
    lineHeight: '1.4',
    letterSpacing: '1px',
    boxSizing: 'border-box',
  } as CSSProperties,
  h1Subtitle: {
    fontSize: '12px',
    color: '#999',
    marginTop: '15px',
    fontFamily: "'Courier New', monospace",
    display: 'block',
  } as CSSProperties,

  // Level 2 Header (The Cartridge Style)
  h2Container: {
    textAlign: 'center',
    marginTop: '50px',
    marginBottom: '30px',
    lineHeight: '1.2',
  } as CSSProperties,
  h2: {
    display: 'inline-block',
    backgroundColor: '#FF4757',
    color: '#ffffff',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '18px',
    fontWeight: 900,
    padding: '8px 16px',
    border: '3px solid #1a1a1a',
    boxShadow: '4px 4px 0px #1a1a1a',
    borderRadius: '2px',
    margin: '0',
    letterSpacing: '1px',
    boxSizing: 'border-box',
  } as CSSProperties,

  // Level 3 Header (Flex badge style)
  h3Container: {
    marginTop: '30px',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
  } as CSSProperties,
  h3Badge: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px',
    padding: '4px 8px',
    marginRight: '10px',
    borderRadius: '2px',
    display: 'inline-block', // Fallback
    lineHeight: '1',
  } as CSSProperties,
  h3: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: '0',
    display: 'inline-block',
  } as CSSProperties,

  // Level 4 (Details with border left)
  h4: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    margin: '20px 0 10px 0',
    paddingLeft: '10px',
    borderLeft: '4px solid #FFD700',
    lineHeight: '1.4',
  } as CSSProperties,

  // Paragraphs
  p: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'justify',
  } as CSSProperties,

  // Text Modifiers
  strong: {
    background: '#FFF5AA',
    borderBottom: '2px solid #FFD700',
    padding: '0 4px',
    fontWeight: 'bold',
  } as CSSProperties,

  code: {
    backgroundColor: '#1a1a1a',
    color: '#00E099',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'Menlo, monospace',
    fontSize: '14px',
  } as CSSProperties,

  a: {
    color: '#FF4757',
    textDecoration: 'none',
    borderBottom: '2px dashed #FF4757',
    fontWeight: 'bold',
  } as CSSProperties,

  // Blockquote (Complex structure)
  blockquote: {
    backgroundColor: '#FFFBF0',
    border: '2px solid #1a1a1a',
    padding: '0',
    margin: '20px 0',
    fontSize: '15px',
    color: '#555',
    boxShadow: '4px 4px 0 #FF4757',
    overflow: 'hidden',
    boxSizing: 'border-box',
  } as CSSProperties,
  blockquoteBadge: {
    background: '#FF4757',
    color: '#fff',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
    borderRight: '2px solid #1a1a1a',
    borderBottom: '2px solid #1a1a1a',
    fontFamily: "'Courier New', monospace",
  } as CSSProperties,
  blockquoteContent: {
    padding: '15px',
  } as CSSProperties,

  // List Containers
  ul: {
    paddingLeft: '0',
    marginBottom: '25px',
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#333',
    listStyleType: 'none',
  } as CSSProperties,
  ol: {
    paddingLeft: '0',
    marginBottom: '25px',
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#333',
    listStyleType: 'none',
  } as CSSProperties,

  // List Items
  liUl: {
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'baseline',
  } as CSSProperties,
  liOl: {
    marginBottom: '8px',
    display: 'flex',
    // No align-items: baseline in demo for OL, effectively 'stretch' or 'flex-start' depending on browser default, 
    // but usually text aligns top. The demo has margin-top: 4px on the marker to align with text.
  } as CSSProperties,

  // Markers
  ulMarker: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    border: '2px solid #1a1a1a',
    marginRight: '12px',
    flexShrink: 0,
    boxShadow: '2px 2px 0 #1a1a1a',
  } as CSSProperties,
  olMarker: {
    background: '#1a1a1a',
    color: '#FFD700',
    fontFamily: 'monospace',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    marginRight: '10px',
    marginTop: '4px', // Visual alignment correction
    border: '1px solid #1a1a1a',
    flexShrink: 0,
  } as CSSProperties,
  
  // Divider / HR
  hrContainer: {
    textAlign: 'center',
    margin: '40px 0',
    opacity: 0.3,
  } as CSSProperties,
  hrText: {
    fontSize: '20px',
    color: '#1a1a1a',
    letterSpacing: '10px',
  } as CSSProperties,

  // Code Block Container
  pre: {
    margin: '10px 0 30px 0',
    border: '2px solid #1a1a1a',
    borderRadius: '6px',
    overflow: 'hidden',
    boxShadow: '6px 6px 0px #eee',
    backgroundColor: '#282c34',
    textAlign: 'left',
    boxSizing: 'border-box',
    width: '100%',
  } as CSSProperties,
  preHeader: {
    backgroundColor: '#1a1a1a',
    padding: '8px 12px',
    borderBottom: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as CSSProperties,
  preDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block', // explicit inline block
  } as CSSProperties,
  preBody: {
    padding: '15px',
    overflowX: 'auto',
    backgroundColor: '#282c34',
    fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#abb2bf',
    whiteSpace: 'pre',
  } as CSSProperties,
  
  // Footer
  footer: {
    marginTop: '60px',
    paddingTop: '20px',
    borderTop: '2px dashed #eee',
    textAlign: 'center',
  } as CSSProperties,
  footerIcon: {
    width: '40px',
    height: '40px',
    background: '#FFD700',
    margin: '0 auto 15px auto',
    border: '2px solid #1a1a1a',
    boxShadow: '4px 4px 0 #FF4757',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  } as CSSProperties
};