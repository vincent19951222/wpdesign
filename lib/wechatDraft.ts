export const CLASSIC_PIXEL_API_SAFE_THEME_ID = 'pixel-classic-api-safe';

const cloneAttributes = (from: Element, to: Element) => {
  Array.from(from.attributes).forEach((attr) => {
    if (attr.name === 'id') return;
    to.setAttribute(attr.name, attr.value);
  });
};

const replaceElementTag = (element: Element, tagName: string) => {
  const doc = element.ownerDocument;
  const replacement = doc.createElement(tagName);
  cloneAttributes(element, replacement);

  while (element.firstChild) {
    replacement.appendChild(element.firstChild);
  }

  element.replaceWith(replacement);
  return replacement;
};

const appendStyle = (element: Element, extraStyle: string) => {
  const current = element.getAttribute('style');
  element.setAttribute('style', current ? `${current}; ${extraStyle}` : extraStyle);
};

const preserveCodeIndentation = (line: string) => line.replace(/^\s+/, (indent) => indent.replace(/ /g, '\u00a0'));

const normalizeListForDraft = (list: Element) => {
  const doc = list.ownerDocument;
  const wrapper = doc.createElement('div');
  cloneAttributes(list, wrapper);

  Array.from(list.children).forEach((item) => {
    const row = doc.createElement('p');
    const rowStyle = item.getAttribute('style');

    if (rowStyle) {
      row.setAttribute('style', rowStyle);
    }

    const children = Array.from(item.childNodes);
    children.forEach((child, index) => {
      if (child.nodeType === doc.TEXT_NODE && !child.textContent?.trim()) {
        return;
      }

      if (child.nodeType === doc.ELEMENT_NODE) {
        const childElement = child as HTMLElement;

        if (index === 0) {
          if (!childElement.style.display) childElement.style.display = 'inline-block';
          childElement.style.verticalAlign = 'middle';
        }

        if (index === 1) {
          childElement.style.display = 'inline';
        }
      }

      row.appendChild(child);
    });

    wrapper.appendChild(row);
  });

  list.replaceWith(wrapper);
};

export const extractDraftTitleFromMarkdown = (markdown: string): string => {
  const lines = markdown.split(/\r?\n/);

  for (const line of lines) {
    const match = line.match(/^#\s+(.+?)\s*$/);
    if (match) {
      return match[1].trim();
    }
  }

  return '';
};

export const buildDraftHtmlFromPreview = (root: HTMLElement): string => {
  const clone = root.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');

  const titleContainer = clone.querySelector('[data-wechat-title-container="true"]');
  if (titleContainer) {
    titleContainer.remove();
  }

  const h2Elements = Array.from(clone.querySelectorAll('h2'));
  h2Elements.forEach((heading) => {
    const doc = heading.ownerDocument;
    const styledText = doc.createElement('span');
    const textStyle = heading.getAttribute('style');

    if (textStyle) {
      styledText.setAttribute('style', textStyle);
    }

    styledText.innerHTML = heading.innerHTML;

    const container = doc.createElement('p');
    const parent = heading.parentElement;
    const parentStyle = parent?.getAttribute('style');

    if (parentStyle) {
      container.setAttribute('style', parentStyle);
    }

    container.appendChild(styledText);

    if (
      parent &&
      parent.tagName.toLowerCase() === 'section' &&
      parent.childElementCount === 1 &&
      parent.firstElementChild === heading
    ) {
      parent.replaceWith(container);
    } else {
      heading.replaceWith(container);
    }
  });

  Array.from(clone.querySelectorAll('[data-wechat-h3-container="true"]')).forEach((container) => {
    const doc = container.ownerDocument;
    const badge = container.querySelector('[data-wechat-h3-badge="true"]') as HTMLElement | null;
    const title = container.querySelector('[data-wechat-h3-title="true"]') as HTMLElement | null;

    if (!title) return;

    const row = doc.createElement('p');
    const containerStyle = container.getAttribute('style');
    row.setAttribute(
      'style',
      containerStyle
        ? `${containerStyle}; display:block; line-height:1.5;`
        : 'display:block; line-height:1.5;'
    );

    if (badge) {
      const badgeSpan = doc.createElement('span');
      const badgeStyle = badge.getAttribute('style');
      if (badgeStyle) {
        badgeSpan.setAttribute('style', `${badgeStyle}; vertical-align:middle;`);
      }
      badgeSpan.innerHTML = '&nbsp;';
      row.appendChild(badgeSpan);
    }

    const titleSpan = doc.createElement('span');
    const titleStyle = title.getAttribute('style');
    if (titleStyle) {
      titleSpan.setAttribute('style', `${titleStyle}; vertical-align:middle; margin:0;`);
    }
    titleSpan.innerHTML = title.innerHTML;
    row.appendChild(titleSpan);

    container.replaceWith(row);
  });

  Array.from(clone.querySelectorAll('[data-wechat-code-block="true"]')).forEach((codeBlock) => {
    const doc = codeBlock.ownerDocument;
    const header = codeBlock.querySelector('[data-wechat-code-header="true"]') as HTMLElement | null;
    const label = codeBlock.querySelector('[data-wechat-code-label="true"]') as HTMLElement | null;
    const codeContent = codeBlock.querySelector('[data-wechat-code-content="true"]') as HTMLElement | null;

    if (!codeContent) return;

    const table = doc.createElement('table');
    table.setAttribute(
      'style',
      'width:100%; border-collapse:collapse; table-layout:fixed; margin:1.2em 0; border:2px solid #1a1a1a; background:#282c34;'
    );
    table.setAttribute('cellpadding', '0');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('role', 'presentation');

    const tbody = doc.createElement('tbody');

    if (header) {
      const headerRow = doc.createElement('tr');
      const headerCell = doc.createElement('td');
      headerCell.setAttribute(
        'style',
        'padding:8px 12px; background:#1a1a1a; border-bottom:1px solid #3a3f4b;'
      );

      const headerDiv = doc.createElement('div');
      headerDiv.setAttribute('style', 'background:#1a1a1a;');

      Array.from(header.children).forEach((child, index) => {
        if (child === label) {
          return;
        }

        const dot = doc.createElement('span');
        cloneAttributes(child, dot);
        appendStyle(dot, 'display:inline-block; vertical-align:middle; margin-right:8px;');
        dot.innerHTML = '&nbsp;';
        headerDiv.appendChild(dot);
      });

      if (label) {
        const labelSpan = doc.createElement('span');
        labelSpan.setAttribute(
          'style',
          "display:inline-block; margin-left:12px; color:#00E099; font-family:'Courier New', monospace; font-size:12px; font-weight:700; background:#1a1a1a;"
        );
        labelSpan.innerHTML = label.innerHTML;
        headerDiv.appendChild(labelSpan);
      }

      headerCell.appendChild(headerDiv);
      headerRow.appendChild(headerCell);
      tbody.appendChild(headerRow);
    }

    const bodyRow = doc.createElement('tr');
    const bodyCell = doc.createElement('td');
    bodyCell.setAttribute(
      'style',
      "padding:12px; background:#282c34; color:#E6EDF3; font-family:Menlo, Monaco, Consolas, 'Courier New', monospace; font-size:13px; line-height:1.6;"
    );

    const lines = codeContent.textContent?.replace(/\n$/, '').split('\n') ?? [];

    lines.forEach((line) => {
      const lineP = doc.createElement('p');
      lineP.setAttribute(
        'style',
        "margin:0 0 4px 0; background:#282c34; color:#E6EDF3; font-family:Menlo, Monaco, Consolas, 'Courier New', monospace; font-size:13px; line-height:1.6; white-space:pre-wrap; word-break:break-word; overflow-wrap:anywhere;"
      );
      lineP.textContent = line.length > 0 ? preserveCodeIndentation(line) : '\u00a0';
      bodyCell.appendChild(lineP);
    });

    if (!lines.length) {
      const emptyLine = doc.createElement('p');
      emptyLine.setAttribute(
        'style',
        "margin:0; background:#282c34; color:#E6EDF3; font-family:Menlo, Monaco, Consolas, 'Courier New', monospace; font-size:13px; line-height:1.6;"
      );
      emptyLine.textContent = '\u00a0';
      bodyCell.appendChild(emptyLine);
    } else {
      const paragraphs = Array.from(bodyCell.querySelectorAll('p'));
      const lastParagraph = paragraphs[paragraphs.length - 1];
      if (lastParagraph) {
        appendStyle(lastParagraph, 'margin-bottom:0;');
      }
    }

    bodyRow.appendChild(bodyCell);
    tbody.appendChild(bodyRow);
    table.appendChild(tbody);
    codeBlock.replaceWith(table);
  });

  Array.from(clone.querySelectorAll('[data-wechat-blockquote="true"]')).forEach((blockquote) => {
    const doc = blockquote.ownerDocument;
    const badge = blockquote.querySelector('[data-wechat-blockquote-badge="true"]') as HTMLElement | null;
    const content = blockquote.querySelector('[data-wechat-blockquote-content="true"]') as HTMLElement | null;

    if (!content) return;

    const table = doc.createElement('table');
    table.setAttribute(
      'style',
      'width:100%; border-collapse:collapse; table-layout:fixed; margin:1.3em 0; border:2px solid #1a1a1a; background:#fff8eb;'
    );
    table.setAttribute('cellpadding', '0');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('role', 'presentation');

    const tbody = doc.createElement('tbody');

    if (badge) {
      const badgeRow = doc.createElement('tr');
      const badgeCell = doc.createElement('td');
      badgeCell.setAttribute('style', 'padding:0; background:#fff8eb;');

      const badgeSpan = doc.createElement('span');
      badgeSpan.setAttribute(
        'style',
        "display:inline-block; background:#ff4757; color:#ffffff; padding:4px 10px; font-size:12px; font-weight:700; font-family:'Courier New', monospace; border-right:2px solid #1a1a1a; border-bottom:2px solid #1a1a1a;"
      );
      badgeSpan.innerHTML = badge.innerHTML;

      badgeCell.appendChild(badgeSpan);
      badgeRow.appendChild(badgeCell);
      tbody.appendChild(badgeRow);
    }

    const contentRow = doc.createElement('tr');
    const contentCell = doc.createElement('td');
    contentCell.setAttribute(
      'style',
      'padding:10px 12px; background:#fff8eb; color:#4c5463; line-height:1.8;'
    );
    contentCell.innerHTML = content.innerHTML;

    Array.from(contentCell.querySelectorAll('p')).forEach((paragraph, index, paragraphs) => {
      appendStyle(paragraph, 'margin-top:0;');
      if (index === paragraphs.length - 1) {
        appendStyle(paragraph, 'margin-bottom:0;');
      }
    });

    contentRow.appendChild(contentCell);
    tbody.appendChild(contentRow);
    table.appendChild(tbody);
    blockquote.replaceWith(table);
  });

  Array.from(clone.querySelectorAll('[data-wechat-hr="true"]')).forEach((hrContainer) => {
    const doc = hrContainer.ownerDocument;
    const hrText = hrContainer.querySelector('[data-wechat-hr-text="true"]') as HTMLElement | null;
    const paragraph = doc.createElement('p');
    paragraph.setAttribute(
      'style',
      'margin:2rem 0; text-align:center; opacity:0.35;'
    );

    const span = doc.createElement('span');
    span.setAttribute(
      'style',
      'display:inline-block; font-size:18px; letter-spacing:8px; color:#1a1a1a; text-align:center;'
    );
    span.innerHTML = hrText?.innerHTML || '•••••';

    paragraph.appendChild(span);
    hrContainer.replaceWith(paragraph);
  });

  Array.from(clone.querySelectorAll('[data-wechat-footer="true"]')).forEach((footer) => {
    const doc = footer.ownerDocument;
    const icon = footer.querySelector('[data-wechat-footer-icon="true"]') as HTMLElement | null;
    const title = footer.querySelector('[data-wechat-footer-title="true"]') as HTMLElement | null;
    const subtitle = footer.querySelector('[data-wechat-footer-subtitle="true"]') as HTMLElement | null;
    const cta = footer.querySelector('[data-wechat-footer-cta="true"]') as HTMLElement | null;

    const wrapper = doc.createElement('div');
    wrapper.setAttribute(
      'style',
      'width:100%; margin:2.8em 0 0; text-align:center; border:none;'
    );

    if (icon || cta) {
      const topRow = doc.createElement('p');
      topRow.setAttribute('style', 'margin:0 0 18px; text-align:center;');

      if (icon) {
        const iconSpan = doc.createElement('span');
        iconSpan.setAttribute(
          'style',
          "display:inline-block; vertical-align:middle; min-width:48px; height:48px; line-height:48px; text-align:center; background:#ffd700; color:#1a1a1a; border:3px solid #1a1a1a; font-size:28px; font-weight:900; font-family:'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif; box-shadow:4px 4px 0 #1a1a1a; margin-right:10px;"
        );
        iconSpan.textContent = icon.textContent || '🎮';
        topRow.appendChild(iconSpan);
      }

      if (cta) {
        const ctaSpan = doc.createElement('span');
        ctaSpan.setAttribute(
          'style',
          "display:inline-block; vertical-align:middle; background:#ff4757; color:#ffffff; padding:10px 26px; border:3px solid #1a1a1a; font-family:'Courier New', Courier, monospace; font-size:18px; font-weight:900; letter-spacing:1px; line-height:1.2;"
        );
        ctaSpan.innerHTML = cta.innerHTML;
        topRow.appendChild(ctaSpan);
      }

      wrapper.appendChild(topRow);
    }

    if (title || subtitle) {
      if (title) {
        const titleP = doc.createElement('p');
        titleP.setAttribute(
          'style',
          'margin:0; text-align:center; font-size:18px; font-weight:800; color:#1a1a1a; line-height:1.5;'
        );
        titleP.innerHTML = title.innerHTML;
        wrapper.appendChild(titleP);
      }

      if (subtitle) {
        const subtitleP = doc.createElement('p');
        subtitleP.setAttribute(
          'style',
          "margin:6px 0 0; text-align:center; font-size:12px; color:#999999; font-family:'Courier New', monospace; line-height:1.5;"
        );
        subtitleP.innerHTML = subtitle.innerHTML;
        wrapper.appendChild(subtitleP);
      }
    }

    footer.replaceWith(wrapper);
  });

  Array.from(clone.querySelectorAll('ol, ul')).forEach((list) => {
    normalizeListForDraft(list);
  });

  Array.from(clone.querySelectorAll('section')).forEach((section) => {
    replaceElementTag(section, 'div');
  });

  return clone.outerHTML;
};
