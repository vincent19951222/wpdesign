import { CSSProperties } from 'react';

export interface ITheme {
  meta?: {
    headerType: 'pixel' | 'classic' | 'none';
    footerType: 'pixel' | 'classic' | 'none';
    author?: string;
    description?: string;
  };
  
  // Base Styles
  wrapper: CSSProperties;
  section: CSSProperties;
  
  // Header Bar (Pixel Style)
  headerBar?: CSSProperties;
  headerBarLeft?: CSSProperties;
  headerBarRight?: CSSProperties;
  headerMood?: CSSProperties;
  headerWifi?: CSSProperties;
  headerPower?: CSSProperties;
  headerBatteryBody?: CSSProperties;
  headerBatteryLevel?: CSSProperties;

  // Content
  h1Container: CSSProperties;
  h1: CSSProperties;
  h1Subtitle: CSSProperties;
  h2Container: CSSProperties;
  h2: CSSProperties;
  h3Container: CSSProperties;
  h3Badge: CSSProperties;
  h3: CSSProperties;
  h4: CSSProperties;
  p: CSSProperties;
  strong: CSSProperties;
  code: CSSProperties;
  a: CSSProperties;
  blockquote: CSSProperties;
  blockquoteBadge: CSSProperties;
  blockquoteContent: CSSProperties;
  ul: CSSProperties;
  ol: CSSProperties;
  liUl: CSSProperties;
  liOl: CSSProperties;
  ulMarker: CSSProperties;
  olMarker: CSSProperties;
  hrContainer: CSSProperties;
  hrText: CSSProperties;
  pre: CSSProperties;
  preHeader: CSSProperties;
  preDot: CSSProperties;
  preBody: CSSProperties;
  
  // Footer
  footer: CSSProperties;
  footerIcon: CSSProperties;
  footerText?: CSSProperties;
}
