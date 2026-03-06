const FULL_WIDTH_BLOCK_STYLE = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
};

export function getRenderTheme(theme, renderMode = 'design-preview') {
  if (renderMode !== 'wechat-safe') {
    return theme;
  }

  const safeTheme = {
    ...theme,
    wrapper: {
      ...theme.wrapper,
      padding: '20px 10px',
      backgroundColor: '#f7f9fa',
    },
    section: {
      ...theme.section,
      borderRadius: '0',
      boxShadow: 'none',
      border: '1px solid rgba(26,26,26,0.08)',
    },
    headerBar: {
      ...theme.headerBar,
      backgroundColor: '#1a1a1a',
      color: '#00E099',
      borderRadius: '0',
      borderBottom: '4px solid #FFD700',
      boxShadow: 'none',
      marginBottom: '18px',
      padding: '10px 14px',
    },
    headerBarLeft: {
      ...theme.headerBarLeft,
      display: 'inline-block',
      verticalAlign: 'middle',
    },
    headerBarRight: {
      ...theme.headerBarRight,
      display: 'inline-block',
      verticalAlign: 'middle',
      float: 'right',
    },
    headerMood: {
      ...theme.headerMood,
      color: '#00E099',
      marginRight: '12px',
    },
    headerWifi: {
      ...theme.headerWifi,
      color: '#00E099',
    },
    headerPower: {
      ...theme.headerPower,
      color: '#00E099',
      marginRight: '6px',
    },
    headerBatteryBody: {
      ...theme.headerBatteryBody,
      display: 'inline-block',
      border: '2px solid #00E099',
    },
    headerBatteryLevel: {
      ...theme.headerBatteryLevel,
      backgroundColor: '#FFD700',
    },
    h1Container: {
      ...theme.h1Container,
      textAlign: 'center',
      marginBottom: '30px',
    },
    h1: {
      ...theme.h1,
      display: 'inline-block',
      width: 'auto',
      maxWidth: '100%',
      padding: '16px 18px',
      boxShadow: '4px 4px 0 #1a1a1a',
      textAlign: 'center',
    },
    h1Subtitle: {
      ...theme.h1Subtitle,
      textAlign: 'center',
      marginTop: '16px',
    },
    h2Container: {
      ...theme.h2Container,
      textAlign: 'center',
      marginTop: '32px',
      marginBottom: '18px',
    },
    h2: {
      ...theme.h2,
      display: 'inline-block',
      width: 'auto',
      maxWidth: '100%',
      padding: '14px 18px',
      boxShadow: '4px 4px 0 #1a1a1a',
      textAlign: 'center',
    },
    h3Container: {
      ...theme.h3Container,
      display: 'block',
    },
    h3Badge: {
      ...theme.h3Badge,
      marginBottom: '8px',
    },
    h3: {
      ...theme.h3,
      display: 'inline',
    },
    blockquote: {
      ...theme.blockquote,
      backgroundColor: '#FFFBF0',
      boxShadow: 'none',
      border: '1px solid rgba(26,26,26,0.08)',
      borderLeft: '6px solid #FF4757',
      padding: '0',
      margin: '20px 0',
    },
    blockquoteBadge: {
      ...theme.blockquoteBadge,
      display: 'inline-block',
      background: '#FFF3F5',
      color: '#FF4757',
      borderRight: '0',
      borderBottom: '0',
      margin: '14px 0 0 14px',
      padding: '2px 8px',
    },
    blockquoteContent: {
      ...theme.blockquoteContent,
      padding: '14px',
      color: '#555',
    },
    pre: {
      ...theme.pre,
      boxShadow: 'none',
      border: '2px solid #1a1a1a',
      backgroundColor: '#1a1a1a',
      borderRadius: '0',
    },
    preHeader: {
      ...theme.preHeader,
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    preBody: {
      ...theme.preBody,
      backgroundColor: '#1a1a1a',
      color: '#00E099',
      padding: '14px 16px',
    },
    tableContainer: {
      ...(theme.tableContainer || {}),
      boxShadow: 'none',
      border: '1px solid #1a1a1a',
    },
    footer: {
      ...theme.footer,
      borderTop: '4px dotted rgba(26,26,26,0.12)',
      textAlign: 'center',
      paddingTop: '32px',
    },
    footerIcon: {
      ...theme.footerIcon,
      width: '72px',
      height: '72px',
      lineHeight: '72px',
      fontSize: '32px',
      backgroundColor: '#FFD700',
      border: '4px solid #1a1a1a',
      boxShadow: '8px 8px 0 #FF4757',
      margin: '0 auto 18px auto',
    },
  };

  return safeTheme;
}

export default getRenderTheme;
